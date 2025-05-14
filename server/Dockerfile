# Используем официальный образ для Node.js 20
FROM node:20 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY server/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY server/ ./

# Строим сервер
RUN npm run build

# Устанавливаем рабочую директорию для запуска
WORKDIR /app/dist

# Запуск сервера в продакшн режиме
CMD ["node", "main.js"]
