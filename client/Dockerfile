# Этап сборки
FROM node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Этап сервировки статики
FROM nginx:alpine

# Копируем сборку Vite в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Опционально: кастомный конфиг для Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
