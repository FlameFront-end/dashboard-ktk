# Стадия 1: сборка приложения
FROM node:20 AS build

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходные файлы и выполняем сборку проекта
COPY . ./
RUN npm run build

# Стадия 2: обслуживаем статические файлы с использованием Nginx
FROM nginx:alpine

# Копируем собранные файлы из стадии сборки
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для доступа к приложению
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
