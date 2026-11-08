// Optional static export, not a bundler: HTML is still the source of truth.
import { cp, mkdir, lstat, realpath, rm, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(root, 'dist');
if (dirname(output) !== root) throw new Error('Output must stay inside the project.');
const existing = await lstat(output).catch(() => null);
if (existing) {
  if (existing.isSymbolicLink() || !existing.isDirectory() || (await realpath(output)) !== output)
    throw new Error('Refusing to replace an unsafe output path.');
  await rm(output, { recursive: true });
}
await mkdir(output);
for (const file of ['index.html', 'projects.html', 'contact.html', '404.html'])
  await copyFile(resolve(root, file), resolve(output, file));
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
console.log(`Static site exported to ${output}`);
