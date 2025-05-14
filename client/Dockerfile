FROM node:20 AS build

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client/ ./

RUN npm run build

FROM nginx:alpine

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
