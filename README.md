# News Blog — Performance Optimization

Full-stack stretch assignment using **Python (Flask) + XAMPP MySQL/MariaDB + React**.

## Features

- Article dashboard, search, category filtering, and analytics.
- Database and `articles` table are created automatically at backend startup if missing.
- MySQL indexes, pagination, SQL aggregate analytics.
- React `useMemo` and `useCallback`.
- Loading, network error, and friendly empty states.
- Client/server validation with red invalid fields.
- Plain-text input sanitization and safe React text rendering.
- Accessible labels, semantic HTML, live status, visible keyboard focus, reduced motion.
- Simulated analytics console ping.
- Backend pytest and frontend Vitest tests.

## Requirements

- Windows (instructions below), Python 3.10+, Node.js 18+.
- XAMPP with MySQL/MariaDB enabled.

## Run with XAMPP — no Docker and no manual database creation

1. Open XAMPP Control Panel and click **Start** beside MySQL.
2. In `backend`, copy `.env.example` to `.env`.
3. For a standard XAMPP installation, the defaults are usually:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=news_blog
```

If you configured a MySQL password in XAMPP, enter it after `MYSQL_PASSWORD=`.
If XAMPP uses a different port, update `MYSQL_PORT`.

4. Open a terminal in the project root and run:

```bat
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

`python run.py` connects to the XAMPP MySQL server, creates the `news_blog` database if it does not exist, then creates the `articles` table. You do not need to create the database in phpMyAdmin.

5. Open a second terminal:

```bat
cd frontend
npm install
npm run dev
```

6. Open `http://localhost:5173`. The Flask API is at `http://localhost:5000`; health check: `http://localhost:5000/health`.

## Tests and quality checks

Backend (uses in-memory SQLite for isolated tests):

```bat
cd backend
venv\\Scripts\\activate
pytest -v
```

Frontend:

```bat
cd frontend
npm test
npm run lint
npm run build
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/articles?q=&category=&page=1&per_page=10` | Search/list articles |
| POST | `/api/articles` | Create article |
| GET | `/api/analytics` | Dashboard aggregates |

## Security and deployment

- Keep `.env` private and do not commit it.
- Change the development `SECRET_KEY` and use a non-root MySQL user in production.
- Restrict `CORS_ORIGINS` to the trusted frontend origin.
- Use HTTPS, migrations, backups, and a production WSGI server before deployment.
- Input sanitization is defense in depth; do not use `dangerouslySetInnerHTML`.

## Lighthouse

The UI includes semantic structure, accessible names, visible focus states, and reduced-motion support. Verify Lighthouse in the actual browser environment; a 100% score cannot be guaranteed by source code alone.
