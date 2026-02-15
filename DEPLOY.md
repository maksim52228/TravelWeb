# Деплой проекта на сервер

## 1) Подготовка сервера
- Установите **Node.js 20+**.
- Клонируйте проект на сервер.

## 2) Установка и сборка
```bash
npm ci
npm run build
```

## 3) Запуск в production
```bash
PORT=3001 npm run start
```

После запуска:
- фронтенд раздается из папки `dist/`;
- API доступно по `/api/*`;
- загруженные из админки изображения сохраняются в `uploads/` и отдаются по `/uploads/*`.

## 4) Пример Nginx (reverse proxy)
```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 5) Важное
- Папку `uploads/` не удаляйте при обновлениях.
- Настройте резервные копии `uploads/`, чтобы не терять загруженные изображения.
