
import "server-only";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket = process.env.NEON_S3_BUCKET;

function getStorageConfig() {
  if (!endpoint || !accessKeyId || !secretAccessKey || !region || !bucket) {
    throw new Error("Neon Object Storage configuration is incomplete.");
  }

  return { endpoint, accessKeyId, secretAccessKey, region, bucket };
}

function getS3Client() {
  const config = getStorageConfig();

  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

async function uploadObject(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  const config = getStorageConfig();
  const s3 = getS3Client();

  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}

async function downloadObject(key: string): Promise<Buffer> {
  const config = getStorageConfig();
  const s3 = getS3Client();

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error("File was not found in storage.");
  }

  return Buffer.from(await response.Body.transformToByteArray());
}

async function deleteObject(key: string) {
  const config = getStorageConfig();
  const s3 = getS3Client();

  await s3.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  );
}

// Existing resume functions — preserved
export async function uploadResume(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  return uploadObject(key, buffer, contentType);
}

export async function downloadResume(key: string) {
  return downloadObject(key);
}

export async function deleteResume(key: string) {
  return deleteObject(key);
}

// New Life at ISM gallery image functions
export async function uploadLifeAtISMImage(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  return uploadObject(key, buffer, contentType);
}

export async function downloadLifeAtISMImage(key: string) {
  return downloadObject(key);
}

export async function deleteLifeAtISMImage(key: string) {
  return deleteObject(key);
}
