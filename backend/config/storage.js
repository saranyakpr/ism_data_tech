import "./env.js";
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

async function uploadObject(key, buffer, contentType) {
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

async function downloadObject(key) {
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

async function deleteObject(key) {
  const config = getStorageConfig();
  const s3 = getS3Client();

  await s3.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  );
}

export async function uploadResume(key, buffer, contentType) {
  return uploadObject(key, buffer, contentType);
}

export async function downloadResume(key) {
  return downloadObject(key);
}

export async function deleteResume(key) {
  return deleteObject(key);
}

export async function uploadLifeAtISMImage(key, buffer, contentType) {
  return uploadObject(key, buffer, contentType);
}

export async function downloadLifeAtISMImage(key) {
  return downloadObject(key);
}

export async function deleteLifeAtISMImage(key) {
  return deleteObject(key);
}