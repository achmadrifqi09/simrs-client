FROM ubuntu:latest
FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY . .

RUN npm run lint

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "npm", "--", "start"]
