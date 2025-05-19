require("dotenv").config({ path: "./env.production" });

module.exports = {
  apps: [
    {
      name: "dashboard-api",
      script: "dist/main.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_DB: process.env.POSTGRES_DB,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        TELEGRAM_SUPPORT_BOT_TOKEN: process.env.TELEGRAM_SUPPORT_BOT_TOKEN,
        TELEGRAM_LOGGER_BOT_TOKEN: process.env.TELEGRAM_LOGGER_BOT_TOKEN,

        FRONTEND_URL_PRODUCTION: process.env.FRONTEND_URL_PRODUCTION,
        WEBAPP_BOT_TOKEN: process.env.WEBAPP_BOT_TOKEN,
      },
    },
  ],
};
