// Entry program for make.fun bounty gta6-meme-x-01 (Node 22+, stdlib only).
// The entry is the X post named in POST.json. This program's only job is to
// carry POST.json from the repository into /output, where the gate reads it.
// It validates that POST.json is a JSON object with a url string first, so a
// broken placeholder fails loudly instead of being submitted silently.
//
// Local run: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'POST.json');
const raw = readFileSync(sourcePath, 'utf8');
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  throw new Error('POST.json must be a JSON object');
}
const url = (parsed as Record<string, unknown>).url;
if (typeof url !== 'string' || !url.startsWith('https://')) {
  throw new Error('POST.json must carry a url string starting with https://');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify({ url }) + '\n', 'utf8');
console.log(`Wrote ${join(OUTPUT_DIR, 'POST.json')} for ${url}`);
