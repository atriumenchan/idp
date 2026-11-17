import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile, access } from "fs/promises";
import path from "path";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const KEY_PATTERN = /^orders\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/;

function tokenSecret() {
  const secret = process.env.FILE_TOKEN_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("FILE_TOKEN_SECRET is required in production");
  }
  return "dev-only-file-secret";
}

function r2Ready() {
  return Boolean(
    process.env.R2_BUCKET &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_ENDPOINT,
  );
}

function r2() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });
}

export function assertStorageKey(key: string) {
  if (!KEY_PATTERN.test(key)) throw new Error("Invalid storage key");
  return key;
}

function localPath(key: string) {
  assertStorageKey(key);
  const root = path.resolve(process.cwd(), ".data", "uploads");
  const full = path.resolve(root, ...key.split("/"));
  if (full !== root && !full.startsWith(root + path.sep)) throw new Error("Invalid storage key");
  return { root, full };
}

function sign(op: "get" | "put", key: string, exp: number) {
  const payload = `${op}:${key}:${exp}`;
  return createHmac("sha256", tokenSecret()).update(payload).digest("hex");
}

export function localFileToken(op: "get" | "put", key: string, ttlSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${exp}.${sign(op, key, exp)}`;
}

export function verifyLocalFileToken(op: "get" | "put", key: string, token: string) {
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!sig || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(op, key, exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function newObjectKey(orderId: string, name: string) {
  const safeName = name.replace(/[^A-Za-z0-9._-]/g, "");
  return assertStorageKey(`orders/${orderId}/${safeName}-${randomBytes(6).toString("hex")}`);
}

export async function createUploadTarget(key: string, contentType: string, origin: string) {
  assertStorageKey(key);
  if (r2Ready()) {
    const url = await getSignedUrl(
      r2(),
      new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 600 },
    );
    return { url, method: "PUT" as const };
  }
  const token = localFileToken("put", key, 600);
  const url = `${origin}/api/files/local?key=${encodeURIComponent(key)}&token=${token}&op=put`;
  return { url, method: "PUT" as const };
}

export async function putPrivateObject(key: string, body: Buffer, contentType: string) {
  assertStorageKey(key);
  if (r2Ready()) {
    await r2().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return;
  }
  const { root, full } = localPath(key);
  await mkdir(path.dirname(full), { recursive: true });
  await mkdir(root, { recursive: true });
  await writeFile(full, body);
}

export async function objectExists(key: string) {
  try {
    assertStorageKey(key);
  } catch {
    return false;
  }
  if (r2Ready()) {
    try {
      await r2().send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
  try {
    await access(localPath(key).full);
    return true;
  } catch {
    return false;
  }
}

export async function readPrivateObject(key: string) {
  assertStorageKey(key);
  if (r2Ready()) {
    const result = await r2().send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    const bytes = await result.Body?.transformToByteArray();
    if (!bytes) throw new Error("Empty file");
    return Buffer.from(bytes);
  }
  return readFile(localPath(key).full);
}

export async function signedDownloadUrl(key: string, origin: string, ttlSeconds = 300) {
  assertStorageKey(key);
  if (r2Ready()) {
    return getSignedUrl(r2(), new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }), {
      expiresIn: ttlSeconds,
    });
  }
  const token = localFileToken("get", key, ttlSeconds);
  return `${origin}/api/files/local?key=${encodeURIComponent(key)}&token=${token}&op=get`;
}
