import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const uploadsDir = path.join(rootDir, 'uploads');
const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 3001);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

const allowedExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const sendJson = (res, code, payload) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

const readRequestBody = (req, maxSize = 12 * 1024 * 1024) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > maxSize) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const safeResolve = (base, targetPath) => {
  const normalized = path.normalize(targetPath).replace(/^([/\\])+/, '');
  const resolved = path.join(base, normalized);
  if (!resolved.startsWith(base)) {
    return null;
  }
  return resolved;
};

const serveFile = async (filePath, res) => {
  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
    });
    res.end(file);
    return true;
  } catch {
    return false;
  }
};

await mkdir(uploadsDir, { recursive: true });

const server = createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      sendJson(res, 400, { error: 'Bad request' });
      return;
    }

    const requestUrl = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

    if (req.method === 'GET' && requestUrl.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'POST' && requestUrl.pathname === '/api/upload') {
      const rawBody = await readRequestBody(req);
      const { filename, dataUrl } = JSON.parse(rawBody || '{}');

      if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        sendJson(res, 400, { error: 'Неверный формат изображения.' });
        return;
      }

      const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (!matches) {
        sendJson(res, 400, { error: 'Не удалось прочитать изображение.' });
        return;
      }

      const [, mimeType, base64Data] = matches;
      const extension = allowedExtensions[mimeType];

      if (!extension) {
        sendJson(res, 400, { error: 'Поддерживаются только JPG, PNG, WEBP и GIF.' });
        return;
      }

      const imageBuffer = Buffer.from(base64Data, 'base64');
      if (imageBuffer.length > 8 * 1024 * 1024) {
        sendJson(res, 400, { error: 'Файл слишком большой. Максимум 8MB.' });
        return;
      }

      const cleanName = (filename ?? 'image')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9а-яё_-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'image';

      const now = new Date();
      const folder = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'));
      const targetDir = path.join(uploadsDir, folder);
      await mkdir(targetDir, { recursive: true });

      const fileName = `${Date.now()}-${cleanName}${extension}`;
      const outputPath = path.join(targetDir, fileName);
      await writeFile(outputPath, imageBuffer);

      sendJson(res, 201, { url: `/uploads/${folder}/${fileName}` });
      return;
    }

    if (req.method === 'GET' && requestUrl.pathname.startsWith('/uploads/')) {
      const filePath = safeResolve(uploadsDir, requestUrl.pathname.replace('/uploads/', ''));
      if (!filePath) {
        sendJson(res, 400, { error: 'Invalid path' });
        return;
      }

      const fileExists = await serveFile(filePath, res);
      if (!fileExists) {
        sendJson(res, 404, { error: 'Not found' });
      }
      return;
    }

    if (req.method === 'GET') {
      const requestPath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
      const staticPath = safeResolve(distDir, requestPath);

      if (staticPath) {
        try {
          const stats = await stat(staticPath);
          if (stats.isFile()) {
            const ok = await serveFile(staticPath, res);
            if (ok) {
              return;
            }
          }
        } catch {
          // SPA fallback below
        }
      }

      const ok = await serveFile(path.join(distDir, 'index.html'), res);
      if (!ok) {
        sendJson(res, 404, { error: 'Build files are missing. Run npm run build first.' });
      }
      return;
    }

    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    sendJson(res, 500, { error: message });
  }
});

server.listen(port, host, () => {
  console.log(`TravelWeb server is running on http://${host}:${port}`);
});
