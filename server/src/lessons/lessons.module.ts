import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { LessonEntity } from "./entities/lesson.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DisciplineEntity } from "../disciplines/entities/discipline.entity";
import { TelegramModule } from "../telegram/telegram.module";
import { StudentsModule } from "../students/students.module";
import { StudentEntity } from "../students/entities/student.entity";
import { TelegramBotEntity } from "../telegram/entities/bot.entity";

@Module({
  imports: [
    TelegramModule,
    StudentsModule,
    TypeOrmModule.forFeature([
      LessonEntity,
      DisciplineEntity,
      StudentEntity,
      TelegramBotEntity,
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
