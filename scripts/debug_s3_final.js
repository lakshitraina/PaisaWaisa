import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Create client without special http handler, relying on global env var
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
        console.log("--- START DEBUG ---");
        const command = new GetObjectCommand({
            Bucket: "flatfiles",
            Key: "market_day_data.json"
        });
        const response = await client.send(command);
        const str = await response.Body.transformToString();
        console.log("DATA_START");
        console.log(str);
        console.log("DATA_END");
    } catch (err) {
        console.error("ERROR:", err.message);
        console.error(err);
    }
}

run();
