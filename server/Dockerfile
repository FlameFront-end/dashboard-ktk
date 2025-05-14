FROM node:20

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект и собираем его
COPY . ./
RUN npm run build

# Запускаем сервер
CMD ["node", "dist/main.js"]
