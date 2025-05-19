import { Injectable, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: Telegraf;

  async onModuleInit() {
    this.bot = new Telegraf(process.env.WEBAPP_BOT_TOKEN);

    this.bot.start((ctx) => {
      ctx.reply("Привет! Нажми кнопку ниже, чтобы открыть WebApp.", {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Открыть WebApp",
                web_app: { url: process.env.FRONTEND_URL_PRODUCTION },
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });

    void this.bot.launch();
    console.log("Telegram bot запущен");
  }
}
