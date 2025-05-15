FROM node:20 AS build

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/ ./
RUN npm run build

WORKDIR /app/dist
CMD ["node", "main.js"]
