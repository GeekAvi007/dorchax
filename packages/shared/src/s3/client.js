import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";

export const S3_BUCKET = process.env.S3_BUCKET || "deployments";

export const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "rustfsadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "rustfsadmin",
  },
});

export async function ensureBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`[S3] Created bucket: ${S3_BUCKET}`);
  }
}
