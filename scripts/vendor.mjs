// Commit the production runtime: visitors need neither npm nor an external CDN.
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const vue = JSON.parse(
  await readFile(new URL('../node_modules/vue/package.json', import.meta.url), 'utf8'),
);
if (vue.version !== pkg.dependencies.vue)
  throw new Error('Vue version differs from the pinned dependency. Run npm ci.');
const directory = new URL('../assets/vendor/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const [source, target] of [
  ['dist/vue.global.prod.js', 'vue.global.prod.js'],
  ['LICENSE', 'vue-LICENSE.txt'],
]) {
  const content = await readFile(new URL(`../node_modules/vue/${source}`, import.meta.url));
  const destination = new URL(target, directory);
  const temporary = new URL(`${target}.tmp`, directory);
  await writeFile(temporary, content);
  await rename(temporary, destination);
}
const runtime = await readFile(new URL('vue.global.prod.js', directory));
await writeFile(
  new URL('manifest.json', directory),
  JSON.stringify(
    {
      package: 'vue',
      version: vue.version,
      file: 'vue.global.prod.js',
      sha256: createHash('sha256').update(runtime).digest('hex'),
      source: 'https://registry.npmjs.org/vue',
      license: 'MIT',
    },
    null,
    2,
  ) + '\n',
);
console.log(`Vendored Vue ${vue.version} into ${root}assets/vendor`);
