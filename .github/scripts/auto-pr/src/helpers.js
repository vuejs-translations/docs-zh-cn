import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const SRC_DIR = dirname(fileURLToPath(import.meta.url));

export const AUTO_PR_DIR = resolve(SRC_DIR, "..");
export const ROOT = resolve(AUTO_PR_DIR, "..", "..", "..");
export const STATE_PATH = resolve(AUTO_PR_DIR, "autopr-state.json");

export function isDirectRun(metaUrl) {
  return process.argv[1] && fileURLToPath(metaUrl) === resolve(process.argv[1]);
}

export function setOutput(key, value) {
  const normalized = value ?? "";
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${normalized}\n`);
  }
  if (process.env.LOCAL === "true") {
    console.log(`[local] ${key}=${normalized}`);
  }
}

export function readJson(path, fallback = undefined) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8").replace(/^\uFEFF/, ""));
}

export function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function readState() {
  return readJson(STATE_PATH, {});
}

export function writeState(state) {
  writeJson(STATE_PATH, {
    ...state,
    updated_at: new Date().toLocaleString(),
  });
}
