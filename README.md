# CampusStay (Smart Boarding)

This project is a simple fullstack prototype that serves static frontend files and exposes APIs from a Node/Express backend.

## MySQL integration

The backend can use MySQL via Sequelize. To enable it:

1. Install dependencies from the workspace root:

```bash
cd C:\Users\sandu\Documents\designher
npm install
```

2. Create a MySQL database (example):

```sql
CREATE DATABASE campusstay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Copy `.env.example` to `.env` and set your DB credentials:

```bash
cp .env.example .env
# edit .env and set DB_PASS etc.
```

4. Start the server (from project root):

```bash
npm start
```

The server will attempt to sync models and seed sample boarding records and a default user if the tables are empty.
