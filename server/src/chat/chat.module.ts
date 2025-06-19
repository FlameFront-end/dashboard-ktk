import { forwardRef, Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { MessagesModule } from "../messages/messages.module";
import { ChatController } from "./chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
  imports: [
    MessagesModule,
    TelegramModule,
    TypeOrmModule.forFeature([ChatEntity]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
