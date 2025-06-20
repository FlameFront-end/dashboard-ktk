import { BadRequestException, Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { StudentEntity } from "../students/entities/student.entity";
import { TelegramSettingsDto } from "./dto/telegram-settings.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TelegramBotEntity } from "./entities/bot.entity";
import { TelegramNotificationSettingsEntity } from "./entities/notification-settings.entity";

@Injectable()
export class TelegramService {
  private readonly supportBot: Telegraf;
  private readonly loggerBot: Telegraf;
  private chatId = "2130983218";

  constructor(
    @InjectRepository(TelegramBotEntity)
    private telegramBotRepository: Repository<TelegramBotEntity>,
  ) {
    this.supportBot = new Telegraf(process.env.TELEGRAM_SUPPORT_BOT_TOKEN);
    this.loggerBot = new Telegraf(process.env.TELEGRAM_LOGGER_BOT_TOKEN);
  }

  async sendMessage(message: string, isLogger = false) {
    try {
      const bot = isLogger ? this.loggerBot : this.supportBot;
      await bot.telegram.sendMessage(this.chatId, message);
    } catch (error) {
      console.error("Error while sending message to Telegram:", error);
      throw new Error("Failed to send message to Telegram");
    }
  }

  async verifyToken(token: string) {
    const bot = new Telegraf(token);
    return await bot.telegram.getMe();
  }

  async saveSettings(dto: TelegramSettingsDto, student: StudentEntity) {
    const {
      token,
      newMessage,
      gradeUpdate,
      newGrade,
      newStudent,
      scheduleChange,
      groupCreation,
      studentAddedToGroup,
      studentRemovedFromGroup,
      groupNameChange,
      groupRemoval,
      newLesson,
      lessonRemoved,
      lessonUpdate,
    } = dto;

    const bot = new Telegraf(token);
    const updates = await bot.telegram.getUpdates(0, 10, 0, ["message"]);
    const chatId = updates.find((update) => "message" in update)?.message?.chat
      .id;

    if (!chatId) {
      throw new BadRequestException(
        "Невозможно получить chatId, отправьте сообщение боту",
      );
    }

    let telegramBot = await this.telegramBotRepository.findOne({
      where: { student: { id: student.id } },
      relations: ["settings"],
    });

    if (!telegramBot) {
      telegramBot = this.telegramBotRepository.create({
        token,
        chatId,
        student,
        settings: {
          newMessage,
          gradeUpdate,
          newGrade,
          newStudent,
          scheduleChange,
          groupCreation,
          studentAddedToGroup,
          studentRemovedFromGroup,
          groupNameChange,
          groupRemoval,
          newLesson,
          lessonRemoved,
          lessonUpdate,
        },
      });
    } else {
      telegramBot.token = token;
      telegramBot.chatId = chatId;

      if (!telegramBot.settings) {
        telegramBot.settings = this.telegramBotRepository.manager.create(
          TelegramNotificationSettingsEntity,
          {
            newMessage,
            gradeUpdate,
            newGrade,
            newStudent,
            scheduleChange,
            groupCreation,
            studentAddedToGroup,
            studentRemovedFromGroup,
            groupNameChange,
            groupRemoval,
            newLesson,
            lessonRemoved,
            lessonUpdate,
          },
        );
      } else {
        telegramBot.settings.newMessage = newMessage;
        telegramBot.settings.gradeUpdate = gradeUpdate;
        telegramBot.settings.newGrade = newGrade;
        telegramBot.settings.newStudent = newStudent;
        telegramBot.settings.scheduleChange = scheduleChange;
        telegramBot.settings.groupCreation = groupCreation;
        telegramBot.settings.studentAddedToGroup = studentAddedToGroup;
        telegramBot.settings.studentRemovedFromGroup = studentRemovedFromGroup;
        telegramBot.settings.groupNameChange = groupNameChange;
        telegramBot.settings.groupRemoval = groupRemoval;
        telegramBot.settings.newLesson = newLesson;
        telegramBot.settings.lessonRemoved = lessonRemoved;
        telegramBot.settings.lessonUpdate = lessonUpdate;
      }
    }

    return this.telegramBotRepository.save(telegramBot);
  }

  async getSettingsForStudent(studentId: string) {
    return this.telegramBotRepository.findOne({
      where: { student: { id: studentId } },
      relations: {
        settings: true,
        student: true,
      },
    });
  }

  async sendNotificationIfEnabled(
    studentId: string,
    event: keyof TelegramNotificationSettingsEntity,
    message: string,
  ) {
    const botEntity = await this.telegramBotRepository.findOne({
      where: { student: { id: studentId } },
      relations: ["settings"],
    });

    if (!botEntity) {
      console.warn(`Telegram bot settings not found for student ${studentId}`);
      return;
    }

    const settings = botEntity.settings;

    if (!settings) {
      console.warn(
        `Telegram notification settings missing for student ${studentId}`,
      );
      return;
    }

    if (settings[event]) {
      try {
        const bot = new Telegraf(botEntity.token);
        await bot.telegram.sendMessage(botEntity.chatId, message);
      } catch (error) {
        console.error("Failed to send Telegram message:", error);
      }
    } else {
      console.log(
        `Notification for event "${event}" is disabled for student ${studentId}`,
      );
    }
  }
}
