# Builder
FROM node:lts as Builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

ARG POSTGRES_URL="${POSTGRES_URL:-postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-gemeinde-der-fels-de}?schema=public}"
ARG GDF_FILES_FOLDER="${GDF_FILES_FOLDER:-./test-files}"
ARG GDF_DEV_DATABASE_REPLACE_EXISTING_DATA="0"
ARG NEXT_PUBLIC_GDF_DEV_FEATURE_FLAGS="${NEXT_PUBLIC_GDF_DEV_FEATURE_FLAGS}"
ARG NEXT_PUBLIC_GDF_FEATURE_FLAGS="${NEXT_PUBLIC_GDF_FEATURE_FLAGS}"

ENV GDF_JWT_SIGNING_SECRET="PLEASE CHANGE"

RUN echo "POSTGRES_URL is: $POSTGRES_URL"

RUN pnpm i --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED 1

CMD [ "pnpm", "run", "ci:setup" ]

# RUN pnpx prisma db push

# RUN pnpm run build

# Runner
FROM node:lts as Runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start" ]
