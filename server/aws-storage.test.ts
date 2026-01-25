import { describe, expect, it } from "vitest";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

describe("AWS S3 Configuration", () => {
  it("should have valid AWS credentials configured", async () => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    expect(bucketName).toBeDefined();
    expect(region).toBeDefined();
    expect(accessKeyId).toBeDefined();
    expect(secretAccessKey).toBeDefined();
  });

  it("should be able to connect to S3 with provided credentials", async () => {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    try {
      const command = new ListBucketsCommand({});
      const response = await client.send(command);
      expect(response.Buckets).toBeDefined();
      expect(Array.isArray(response.Buckets)).toBe(true);
    } catch (error: any) {
      // Si las credenciales son inválidas, el test fallará
      throw new Error(`Failed to connect to S3: ${error.message}`);
    }
  });
});
