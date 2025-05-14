# Используем официальный образ для Node.js 20
FROM node:20 AS build

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY client/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY client/ ./

# Строим приложение для продакшн
RUN npm run build

# Используем Nginx для сервинга
FROM nginx:alpine

# Копируем файлы из build
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
