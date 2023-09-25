FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV CONN_STR=mongodb://user:pass@mongodb

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
