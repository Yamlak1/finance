# Personal Finance Tracker API

Node.js + Express backend (JavaScript ESM) using Prisma ORM with PostgreSQL.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and update values:

```bash
copy .env.example .env
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Start server:

```bash
npm run dev
```

## Seed Data

Run Prisma seed manually:

```bash
npm run prisma:seed
```

This creates a `demo_user` and sample income/expense transactions.

## Docker Compose (PostgreSQL + API)

1. Ensure `.env` contains at least:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=personal_finance
```

2. Start services:

```bash
docker compose up --build
```

3. API will be available at `http://localhost:3000` and PostgreSQL at `localhost:5432`.

On startup, the server container runs:

- `npm run prisma:push`
- `npm run prisma:seed`
- `npm start`

## Scripts

- `npm run dev` - Run with nodemon
- `npm start` - Run with node
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push Prisma schema to the database
- `npm run prisma:seed` - Seed demo data

## API Endpoints

- `POST /api/users`
- `POST /api/login`
- `GET /api/users/:id`
- `POST /api/users/:userId/transactions`
- `GET /api/users/:userId/transactions?start&end&limit&offset`
- `PUT /api/users/:userId/transactions/:txId`
- `DELETE /api/users/:userId/transactions/:txId`
- `GET /api/users/:userId/summary?start&end`
