import { Controller, Post, Body, UseGuards, Req, Get } from "@nestjs/common";
import { TelegramSettingsDto } from "./dto/telegram-settings.dto";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TelegramService } from "./telegram.service";
import { StudentsService } from "../students/students.service";
import { VerifyTokenDto } from "./dto/verify-token.dto";

@ApiTags("telegram")
@ApiBearerAuth("jwt")
@UseGuards(JwtAuthGuard)
@Controller("telegram")
export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private studentsService: StudentsService,
  ) {}

  @Post("verify")
  @ApiBody({ type: VerifyTokenDto })
  async verifyToken(@Body() dto: VerifyTokenDto) {
    return this.telegramService.verifyToken(dto.token);
  }

  @Post("settings")
  @ApiBody({ type: TelegramSettingsDto })
  async saveSettings(@Body() dto: TelegramSettingsDto, @Req() req: any) {
    const user = await this.studentsService.findOne(req.user.id);
    return this.telegramService.saveSettings(dto, user);
  }

  @Get("settings")
  async getSettings(@Req() req: any) {
    const user = await this.studentsService.findOne(req.user.id);
    return this.telegramService.getSettingsForStudent(user.id);
  }

  @Post("test-notify")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        event: {
          type: "string",
          description:
            "Тип события (например, newMessage, newGrade, newStudent, scheduleChange)",
          example: "newMessage",
        },
        message: {
          type: "string",
          description: "Текст сообщения, которое отправится в Telegram",
          example: "У вас новое сообщение",
        },
      },
      required: ["event", "message"],
    },
  })
  async testNotify(@Body() dto: any, @Req() req: any) {
    const user = await this.studentsService.findOne(req.user.id);
    await this.telegramService.sendNotificationIfEnabled(
      user.id,
      dto.event,
      dto.message,
    );
    return { status: "ok", message: "Notification sent if enabled" };
  }
}
