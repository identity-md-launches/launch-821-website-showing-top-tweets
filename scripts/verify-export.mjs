import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(join(root, 'dist/index.html'), 'utf8');
const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
assert(urls.length >= 3, 'Expected JavaScript, CSS, and favicon references');
for (const url of urls) {
  assert(url.startsWith('./'), `Export URL must be relative: ${url}`);
  assert((await stat(join(root, 'dist', url))).isFile(), `Missing export asset: ${url}`);
}
assert((await stat(join(root, 'dist/pepe-ai.webp'))).size > 1000, 'Hero artwork is missing');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.github', '.imd', '.agents', '.codex', '.aws', 'test'].includes(entry.name)) continue;
    assert(!['node_modules', '.npm', '.cache'].includes(entry.name), `Dependency/cache directory in submission: ${join(dir, entry.name)}`);
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else { assert(!entry.isSymbolicLink(), `Unexpected symlink: ${path}`); assert(!path.endsWith('.tgz'), `Dependency archive: ${path}`); files.push(path); }
  }
}
await walk(root);
let total = 0;
for (const path of files) total += (await stat(path)).size;
assert(total < 8388608, `Submission ${total} bytes exceeds 8 MiB`);
console.log(`PASS: ${urls.length} relative HTML asset URLs resolve; local hero exists.`);
console.log(`PASS: ${files.length} submission files, ${total} bytes; no caches, dependency archives, or symlinks.`);
