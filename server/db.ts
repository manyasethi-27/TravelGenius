import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "data.json");

export interface DB {
  users: any[];
  trips: any[];
}

export async function getDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { users: [], trips: [] };
  }
}

export async function saveDB(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
