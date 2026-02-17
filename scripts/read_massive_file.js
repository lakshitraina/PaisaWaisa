import https from 'https';

// Create an agent that ignores SSL errors
const agent = new https.Agent({
    rejectUnauthorized: false
});

// Construct the URL manually since it's a "Massive" S3 compatible endpoint
// Pattern: https://files.massive.com/bucket-name/key
const url = "https://files.massive.com/flatfiles/market_day_data.json";

async function readFile() {
    try {
        console.log(`Fetching ${url} with SSL verification disabled...`);
        const response = await fetch(url, {
            dispatcher: agent, // For undici/native fetch in some node versions
            agent: agent // For some polyfills
        });

        // If native fetch doesn't support agent directly, we might need a different approach
        // But let's try this standard approach first or fall back to https.get

        if (!response.ok) {
            console.log(`Failed with status: ${response.status} ${response.statusText}`);
            // If 403, we definitely need AWS Signature V4.
            // If we need SigV4, we MUST use the SDK or a manual signer.

            // Let's assume it failed because of 403 (Private Bucket) in the previous simple attempt.
            // So we DO need the SDK.
            return;
        }

        const text = await response.text();
        console.log("File Content:", text);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// Alternative: Use the SDK but validly this time.
// The previous SDK error `DEPTH_ZERO_SELF_SIGNED_CERT` suggests the SDK *was* trying to connect.
// We just need to correctly pass the http handler.

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler"; // Try this again or fallback

async function readWithSDK() {
    try {
        console.log("Trying SDK with robust SSL bypass...");
        const client = new S3Client({
            region: "us-east-1",
            endpoint: "https://files.massive.com",
            credentials: {
                accessKeyId: "699f2ee9-f04d-4e60-abec-871467067bef",
                secretAccessKey: "GRpwMu_9atumaYEWX6wPWuOhWqAPxbRW"
            },
            forcePathStyle: true,
            requestHandler: new NodeHttpHandler({
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })
        });

        const command = new GetObjectCommand({
            Bucket: "flatfiles",
            Key: "market_day_data.json"
        });

        const response = await client.send(command);
        const str = await response.Body.transformToString();
        console.log("SDK Content:", str);

    } catch (e) {
        console.error("SDK Error:", e);
    }
}

readWithSDK();
