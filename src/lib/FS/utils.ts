import { Buffer } from "buffer";
import { config } from "dotenv";
import { readFile as fsReadFile, writeFile } from "fs/promises";
import fs from "fs";

config();

const dataPath = process.env.JSON_FILES_LOCATION!;
if (!dataPath) {
  throw new Error("No JSON files location provided");
}

export async function writeToFile(filePath: string, content: string, controller: AbortController) {
  const data = new Uint8Array(Buffer.from(content));
  return writeFile(filePath, data, { signal: controller.signal });
}

export async function readFile(filePath: string, controller: AbortController): Promise<string | undefined> {
  if (!doesFileExist(filePath)) {
    return undefined;
  }

  const buffer = await fsReadFile(filePath, { signal: controller.signal });
  return buffer.toString();
}

export function readFileSync(filePath: string): string | undefined {
  if (!doesFileExist(filePath)) {
    return undefined;
  }

  const buffer = fs.readFileSync(filePath);
  return buffer.toString();
}

export function doesFileExist(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function databasePath(path: string): string {
  return `${dataPath}/${path}`;
}

export function createDataDirIfMissing() {
  createDirIfMissing(dataPath);
}

export function createDirIfMissing(path: string) {
  if (fs.existsSync(path)) return;
  fs.mkdirSync(path);
}
