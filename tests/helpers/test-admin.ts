import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const TEST_ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").trim();
const TEST_ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "").trim();

if (!TEST_ADMIN_EMAIL || !TEST_ADMIN_PASSWORD) {
  throw new Error(
    "Missing ADMIN_EMAIL / ADMIN_PASSWORD for tests. Set them in the environment or in .env.local.",
  );
}

export { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD };
