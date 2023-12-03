FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/gemeinde-der-fels-de?schema=public"
ENV GDF_JWT_SIGNING_SECRET="BiGpC28DyjcsEkaBBaSEK6oTifTHx2E8"
ENV GDF_FILES_FOLDER="./test-files"
ENV GDF_DEV_DATABASE_REPLACE_EXISTING_DATA="0"
ENV NEXT_PUBLIC_GDF_DEV_FEATURE_FLAGS="*"

EXPOSE 3000

RUN npx prisma db push

RUN npm run build

CMD [ "npm", "run", "start" ]
