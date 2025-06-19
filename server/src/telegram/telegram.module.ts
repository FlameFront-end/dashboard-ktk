import { forwardRef, Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { TelegramBotService } from "./telegram-bot.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegramBotEntity } from "./entities/bot.entity";
import { TelegramController } from "./telegram.controller";
import { StudentsModule } from "../students/students.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramBotEntity]),
    forwardRef(() => StudentsModule),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramBotService],
  exports: [TelegramService],
})
export class TelegramModule {}
