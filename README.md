# README

## Requirements

- Running PostgreSQL server (docker compose file does include one)

## Start development

1. Install Node.js
2. Install `pnpm` package manager

```
pnpm run dev
```

## Build and deploy website

1. Run `./script/deploy.sh` - This builds all dependencies and deploys the
   website in multiple composed docker containers.
