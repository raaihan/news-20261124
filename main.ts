// news-image-20261124 — "The World Today", Tuesday 24 November 2026.
// Node 22, standard library only. The program copies news-20261124.png
// (the front-page image beside this file) to entry.png in the output
// directory. No network, no randomness: every run writes the same bytes.
// After the copy it verifies the output against the source — size and
// sha256 — and exits non-zero on any mismatch, so a truncated or
// corrupted write fails loudly instead of reaching the judge. The output
// directory is created if it does not exist yet.
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const source = new URL('./news-20261124.png', import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });
const output = join(outputDir, 'entry.png');

function fingerprint(file: string | URL): { size: number; sha256: string } {
  const bytes = readFileSync(file);
  return { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
}

copyFileSync(source, output);

const before = fingerprint(source);
const after = fingerprint(output);
if (before.size !== after.size || before.sha256 !== after.sha256) {
  console.error(
    `entry.png verification failed: source ${before.size} bytes ${before.sha256} != output ${after.size} bytes ${after.sha256}`,
  );
  process.exit(1);
}
console.log(`entry.png written: ${after.size} bytes, sha256 ${after.sha256}`);
