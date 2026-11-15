// Rewrites a PORTABLE=1 (build.format: 'file') build so every internal URL is
// relative. The result runs from any folder, a sub-path, or a sandboxed host.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);

function mapPath(url, prefix) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const m = url.match(/^([^?#]*)(.*)$/);
  let path = m[1]; const tail = m[2];
  if (path === '/') path = '/index.html';
  else if (path.endsWith('/')) path = path.slice(0, -1) + '.html';
  else if (!/\.[a-z0-9]+$/i.test(path)) path = path + '.html';
  return prefix + path.slice(1) + tail;
}

let count = 0;
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const rel = relative(DIST, f).split(sep);
  const prefix = rel.length > 1 ? '../'.repeat(rel.length - 1) : './';
  let html = readFileSync(f, 'utf8');
  html = html.replace(/\b(href|src|poster|action)=("|')(\/[^"']*)\2/g, (_, a, q, u) => { count++; return `${a}=${q}${mapPath(u, prefix)}${q}`; });
  html = html.replace(/\b(srcset|imagesrcset)=("|')([^"']*)\2/g, (_, a, q, v) =>
    `${a}=${q}${v.split(',').map((part) => { const [u, ...rest] = part.trim().split(/\s+/); return [mapPath(u, prefix), ...rest].join(' '); }).join(', ')}${q}`);
  html = html.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (_, q, u) => `url(${q}${mapPath(u, prefix)}${q})`);
  html = html.replace(/(import\s*(?:[^'"]*from\s*)?["'])(\/assets\/[^"']+)(["'])/g, (_, a, u, b) => `${a}${prefix}${u.slice(1)}${b}`);
  writeFileSync(f, html);
}
for (const f of files.filter((f) => f.endsWith('.css'))) {
  let css = readFileSync(f, 'utf8');
  css = css.replace(/url\((['"]?)\/assets\/([^)'"]+)\1\)/g, (_, q, u) => `url(${q}./${u}${q})`);
  css = css.replace(/url\((['"]?)\/(media\/[^)'"]+)\1\)/g, (_, q, u) => `url(${q}../${u}${q})`);
  writeFileSync(f, css);
}
console.log(`portable: rewrote ${count} attributes across ${files.filter((f) => f.endsWith('.html')).length} pages`);
