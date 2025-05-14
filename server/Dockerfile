# Пример Dockerfile для сервера
FROM node:20

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Выполняем сборку перед запуском
RUN npm run build

# Запускаем сервер в режиме production
CMD ["npm", "run", "start:prod"]
