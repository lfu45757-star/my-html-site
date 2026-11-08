import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { compile } from '@vue/compiler-dom';
const pages = ['index.html', 'projects.html', 'contact.html', '404.html'];
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  test(`${file}: semantic HTML and Vue template compile`, () => {
    assert.match(html, /<html lang="zh-CN">/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /name="description"\s+content="[^"]+"/);
    assert.match(html, /class="skip-link"/);
    const template = html.match(/<div id="app">([\s\S]*)<\/div>\s*<\/body>/)[1];
    const errors = [];
    compile(template, { onError: (error) => errors.push(error.message) });
    assert.deepEqual(errors, []);
  });
  test(`${file}: local files and external link safety`, async () => {
    for (const [, url] of html.matchAll(/\s(?:src|srcset|href)="([^"{]+)"/g)) {
      if (/^(https?:|mailto:|#|\/)/.test(url)) continue;
      await access(resolve(url.split('#')[0]));
    }
    for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
      assert.match(tag, /rel="noopener noreferrer"/);
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag, /(?:alt|:alt)="[^"]+"/);
  });
}
test('Vue runtime is pinned and matches the vendored checksum', async () => {
  const manifest = JSON.parse(await readFile('assets/vendor/manifest.json', 'utf8'));
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(manifest.version, pkg.dependencies.vue);
  assert.equal(
    createHash('sha256')
      .update(await readFile('assets/vendor/vue.global.prod.js'))
      .digest('hex'),
    manifest.sha256,
  );
  assert.match(await readFile('assets/vendor/vue-LICENSE.txt', 'utf8'), /MIT License/);
});
test('all original projects and direct contact are preserved', async () => {
  const html = await readFile('projects.html', 'utf8');
  for (const name of ['wechatbot', 'douyin-favorite-MyLike', 'YouDub-webui'])
    assert.ok(html.includes(`https://github.com/lfu45757-star/${name}`));
  assert.match(await readFile('contact.html', 'utf8'), /mailto:lfu45757@gmail.com/);
});
