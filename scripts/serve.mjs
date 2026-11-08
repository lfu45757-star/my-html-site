import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};
const publicPages = new Set(['index.html', 'projects.html', 'contact.html', '404.html']);
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    const relative = pathname.slice(1);
    const file = resolve(root, relative);
    const inside = file.startsWith(resolve(root) + sep);
    const allowed =
      publicPages.has(relative) ||
      (relative.startsWith('assets/') && !relative.split('/').some((part) => part.startsWith('.')));
    if (!inside || !allowed || !(await stat(file).catch(() => null))?.isFile()) {
      const isAsset = !!extname(pathname) && extname(pathname) !== '.html';
      response.writeHead(404, {
        'Content-Type': isAsset ? 'text/plain; charset=utf-8' : types['.html'],
        'Cache-Control': 'no-store',
      });
      response.end(
        request.method === 'HEAD'
          ? undefined
          : isAsset
            ? 'Not found'
            : await readFile(resolve(root, '404.html')),
      );
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : await readFile(file));
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.end('Bad request');
  }
});
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
