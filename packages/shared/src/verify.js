import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { db, pgClient, projects } from "./db/index.js";
import { s3Client, S3_BUCKET, ensureBucketExists } from "./s3/client.js";
import { buildQueue } from "./queue/buildQueue.js";

async function verifyMilestone1() {
  console.log("1. Testing Local S3 (RustFS)...");
  await ensureBucketExists();
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: "healthcheck/hello.txt",
      Body: "Dorchax local S3 is online!",
      ContentType: "text/plain",
    })
  );
  const s3Res = await s3Client.send(
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: "healthcheck/hello.txt" })
  );
  const text = await s3Res.Body?.transformToString();
  console.log("   S3 Readback:", text);

  console.log("2. Testing PostgreSQL + Drizzle...");
  const allProjects = await db.select().from(projects);
  console.log("   Postgres connected! Current projects count:", allProjects.length);

  console.log("3. Testing Redis + BullMQ...");
  const counts = await buildQueue.getJobCounts();
  console.log("   BullMQ connected! Queue counts:", counts);

  await buildQueue.close();
  await pgClient.end();
  console.log("\nMilestone 1 Complete: All 3 infrastructure services are healthy.");
}

verifyMilestone1().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
