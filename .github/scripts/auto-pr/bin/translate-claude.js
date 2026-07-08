import { translateConflicts } from "../src/translator.js";

try {
  translateConflicts({
    provider: process.env.TRANSLATE_PROVIDER || "claude",
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
