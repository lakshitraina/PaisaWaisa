import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

// Create client with SSL validation disabled for the signing process
const client = new S3Client({
    region: "us-east-1",
    endpoint: "https://files.massive.com",
    credentials: {
        accessKeyId: "699f2ee9-f04d-4e60-abec-871467067bef",
        secretAccessKey: "GRpwMu_9atumaYEWX6wPWuOhWqAPxbRW"
    },
    forcePathStyle: true
});

async function run() {
    try {
        const command = new GetObjectCommand({
            Bucket: "flatfiles",
            Key: "market_day_data.json"
        });

        // Generate a URL valid for 7 days (604800 seconds)
        const url = await getSignedUrl(client, command, { expiresIn: 604800 });
        console.log("PRESIGNED_URL_GENERATED");
        fs.writeFileSync('scripts/presigned_url.txt', url);

    } catch (err) {
        console.error("Error generating presigned URL:", err);
    }
}

run();
