import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: "us-east-1",
    endpoint: "https://files.massive.com",
    credentials: {
        accessKeyId: "699f2ee9-f04d-4e60-abec-871467067bef",
        secretAccessKey: "GRpwMu_9atumaYEWX6wPWuOhWqAPxbRW"
    },
    forcePathStyle: true
});

async function listBucket() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: "flatfiles"
        });
        const response = await client.send(command);

        console.log("Bucket Contents:");
        if (response.Contents) {
            response.Contents.forEach(obj => {
                console.log(`- ${obj.Key} (Size: ${obj.Size}, LastModified: ${obj.LastModified})`);
            });
        } else {
            console.log("Bucket is empty.");
        }
    } catch (err) {
        console.error("Error listing bucket:", err);
    }
}

listBucket();
