import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonEntity } from "./entities/lesson.entity";
import { DisciplineEntity } from "../disciplines/entities/discipline.entity";
import { StudentEntity } from "../students/entities/student.entity";
import { TelegramBotEntity } from "../telegram/entities/bot.entity";
import { TelegramNotificationSettingsEntity } from "../telegram/entities/notification-settings.entity";
import { Telegraf } from "telegraf";
import { MessagesService } from "../messages/messages.service";
import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonEntity)
    private readonly lessonRepository: Repository<LessonEntity>,

    @InjectRepository(DisciplineEntity)
    private readonly disciplineRepository: Repository<DisciplineEntity>,

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    private readonly telegramService: TelegramService,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<LessonEntity> {
    const discipline = await this.disciplineRepository.findOne({
      where: { id: createLessonDto.disciplineId },
    });
    if (!discipline) throw new NotFoundException("Discipline not found");

    const filesData =
      createLessonDto.files?.map((file: Express.Multer.File) => ({
        originalName: file.originalname,
        url: `http://localhost:3000/uploads/${file.filename}`,
      })) || [];

    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      discipline,
      files: filesData,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    if (createLessonDto.groupId) {
      const students = await this.studentRepository.find({
        where: { group: { id: createLessonDto.groupId } },
      });

      for (const student of students) {
        await this.telegramService.sendNotificationIfEnabled(
          student.id,
          "newLesson",
          `Новая лекция по дисциплине "${discipline.name}":\n\n` +
            `Название: ${createLessonDto.title}\n\n` +
            `Описание:\n${createLessonDto.description || ""}\n\n` +
            `Домашнее задание:\n${createLessonDto.homework || ""}`,
        );
      }
    }

    return savedLesson;
  }

  async findAll(): Promise<LessonEntity[]> {
    return this.lessonRepository.find({ relations: ["discipline"] });
  }

  async findByGroupAndDiscipline(
    groupId: string,
    disciplineId: string,
  ): Promise<LessonEntity[]> {
    return this.lessonRepository.find({
      where: {
        groupId: groupId,
        discipline: { id: disciplineId },
      },
      relations: ["discipline"],
    });
  }

  async findOne(id: string): Promise<LessonEntity> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ["discipline"],
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonEntity> {
    const lesson = await this.findOne(id);
    const oldLesson = { ...lesson };

    Object.assign(lesson, updateLessonDto);

    if (updateLessonDto.files && Array.isArray(updateLessonDto.files)) {
      lesson.files = updateLessonDto.files.filter((file) => !!file.url);
    }

    const updatedLesson = await this.lessonRepository.save(lesson);

    const changes: string[] = [];

    if (updateLessonDto.title && updateLessonDto.title !== oldLesson.title) {
      changes.push(
        `Название: "${oldLesson.title}" → "${updateLessonDto.title}"`,
      );
    }

    if (
      updateLessonDto.description &&
      updateLessonDto.description !== oldLesson.description
    ) {
      changes.push("Изменено описание лекции");
    }

    if (
      updateLessonDto.homework &&
      updateLessonDto.homework !== oldLesson.homework
    ) {
      changes.push("Изменено домашнее задание лекции");
    }

    if (
      updateLessonDto.files &&
      updateLessonDto.files.length !== oldLesson.files.length
    ) {
      changes.push(
        `Обновлены материалы (файлов: ${oldLesson.files.length} → ${updateLessonDto.files.length})`,
      );
    }

    if (changes.length > 0 && lesson.groupId) {
      const students = await this.studentRepository.find({
        where: { group: { id: lesson.groupId } },
      });

      const message =
        `Лекция "${lesson.discipline.name}" обновлена:\n\n` +
        changes.map((c) => `• ${c}`).join("\n") +
        `\n\nПроверьте обновленные материалы.`;

      for (const student of students) {
        await this.telegramService.sendNotificationIfEnabled(
          student.id,
          "lessonUpdate",
          message,
        );
      }
    }

    return updatedLesson;
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id);

    if (lesson.groupId) {
      const students = await this.studentRepository.find({
        where: { group: { id: lesson.groupId } },
      });

      for (const student of students) {
        await this.telegramService.sendNotificationIfEnabled(
          student.id,
          "lessonRemoved",
          `Лекция "${lesson.discipline.name}" (${lesson.title}) была удалена`,
        );
      }
    }

    await this.lessonRepository.delete(id);
  }
}
