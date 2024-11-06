# README

## Requirements

- Running PostgreSQL server (docker compose file does include one)

## Setup the project

1. Install Node.js: [Website](https://nodejs.org/en)
2. Install `pnpm` package manager:

```bash
npm install -g pnpm
```

3. Start PostgreSQL server (if not already running)
4. Copy `.env.sample` file to `.env` and fill the containing variables with
   correct configurations.
5. Create a database in the PostgreSQL server by running this command:

```bash
pnpx prisma db push
```

## Start development

By running the following command you can start the website in development mode:

```bash
pnpm run dev
```

In this development mode, Next.js is automatically recompiling the website code
when it detects any changes.

## Build website

TODOC: Needs work
