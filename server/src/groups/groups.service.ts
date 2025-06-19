import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupEntity } from "./entities/group.entity";
import { Lesson, ScheduleEntity } from "./entities/schedule.entity";
import { TeacherEntity } from "../teachers/entities/teacher.entity";
import { StudentEntity } from "../students/entities/student.entity";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { DisciplineEntity } from "../disciplines/entities/discipline.entity";
import { GradeEntity } from "./entities/grade.entity";
import * as moment from "moment";
import { SaveGradesDto } from "./dto/save-grades.dto";
import { ChatEntity } from "../chat/entities/chat.entity";
import { MessagesService } from "../messages/messages.service";
import { ChatService } from "../chat/chat.service";
import { plainToClass } from "class-transformer";
import { TelegramService } from "../telegram/telegram.service";

export interface GradeData {
  [studentId: string]: string;
}

export interface DisciplineGrades {
  [date: string]: GradeData;
}

@Injectable()
export class GroupsService {
  constructor(
    private readonly chatService: ChatService,
    private readonly telegramService: TelegramService,
    private readonly messagesService: MessagesService,

    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,

    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,

    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,

    @InjectRepository(DisciplineEntity)
    private readonly disciplineRepository: Repository<DisciplineEntity>,

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,

    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async sendGroupChangeMessage(student: any, message: string, chatId: string) {
    this.chatService.broadcastParticipantUpdate(message, chatId, {
      id: student.id,
      name: "Системное оповещание",
      phone: student.phone,
      email: student.email,
    });

    await this.messagesService.create({
      text: message,
      chatId: chatId,
      senderId: "system",
      senderType: "system",
      userId: null,
    });
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
    const { name, teacher: teacherId, students, schedule } = createGroupDto;

    const teacherEntity = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ["group"],
    });

    if (!teacherEntity) {
      throw new NotFoundException("Teacher not found");
    }

    if (teacherEntity.group) {
      throw new BadRequestException(
        "This teacher is already assigned to a group.",
      );
    }

    let studentEntities: StudentEntity[] = [];
    if (students && students.length > 0) {
      studentEntities = await this.studentRepository.findByIds(students);
    }

    const scheduleEntity = this.scheduleRepository.create({
      monday: await this.processLessons(schedule.monday),
      tuesday: await this.processLessons(schedule.tuesday),
      wednesday: await this.processLessons(schedule.wednesday),
      thursday: await this.processLessons(schedule.thursday),
      friday: await this.processLessons(schedule.friday),
    });

    await this.scheduleRepository.save(scheduleEntity);

    const group = this.groupRepository.create({
      name,
      students: studentEntities,
      schedule: scheduleEntity,
    });

    const savedGroup = await this.groupRepository.save(group);

    teacherEntity.group = savedGroup;
    await this.teacherRepository.save(teacherEntity);

    savedGroup.teacher = teacherEntity;
    await this.groupRepository.save(savedGroup);

    const chat = this.chatRepository.create({ groupId: savedGroup.id });
    const savedChat = await this.chatRepository.save(chat);

    savedGroup.chat = savedChat;
    await this.groupRepository.save(savedGroup);

    const teachingTeacherIds = new Set<string>();
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    for (const day of days) {
      const lessons = schedule[day] || [];
      for (const lesson of lessons) {
        if (lesson.teacher?.id) {
          teachingTeacherIds.add(lesson.teacher.id);
        }
      }
    }

    for (const tId of teachingTeacherIds) {
      if (tId === teacherEntity.id) continue;

      const teacher = await this.teacherRepository.findOne({
        where: { id: tId },
        relations: ["teachingGroups"],
      });

      if (teacher) {
        const alreadyInGroup = teacher.teachingGroups?.some(
          (g) => g.id === savedGroup.id,
        );
        if (!alreadyInGroup) {
          teacher.teachingGroups = [
            ...(teacher.teachingGroups || []),
            savedGroup,
          ];
          await this.teacherRepository.save(teacher);
        }
      }
    }

    // Отправка уведомлений о создании группы и добавлении в чат
    const groupCreateMessage = `Группа "${savedGroup.name}" создана. Вы добавлены в чат группы.`;
    for (const student of studentEntities) {
      await this.telegramService.sendNotificationIfEnabled(
        student.id,
        "groupCreation",
        groupCreateMessage,
      );
    }

    await this.messagesService.create({
      text: `Группа "${savedGroup.name}" создана. Участники добавлены в чат.`,
      chatId: savedChat.id,
      senderId: null,
      senderType: "system",
      userId: null,
    });

    return plainToClass(GroupEntity, savedGroup, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ["schedule", "teacher", "students", "chat"],
    });

    if (!group) {
      throw new NotFoundException("Group not found");
    }

    const { name, students, schedule } = updateGroupDto;

    if (schedule) {
      const oldSchedule = group.schedule;
      const newSchedule = schedule;

      const dayNames = {
        monday: "понедельник",
        tuesday: "вторник",
        wednesday: "среда",
        thursday: "четверг",
        friday: "пятница",
      };

      const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
      const allChanges: { day: string; changes: string[] }[] = [];

      for (const day of days) {
        const oldLessons = oldSchedule[day] || [];
        const newLessons = newSchedule[day] || [];

        if (JSON.stringify(oldLessons) !== JSON.stringify(newLessons)) {
          const changes: string[] = [];
          const russianDayName = dayNames[day];

          for (const newLesson of newLessons) {
            const oldLessonExists = oldLessons.some(
              (old) => old.discipline.id === newLesson.discipline.id,
            );

            if (!oldLessonExists) {
              changes.push(
                `Добавлено: ${newLesson.discipline.name} (${newLesson.teacher?.name || "преподаватель не указан"})`,
              );
            }
          }

          for (const oldLesson of oldLessons) {
            const newLessonExists = newLessons.some(
              (newL) => newL.discipline.id === oldLesson.discipline.id,
            );

            if (!newLessonExists) {
              changes.push(`Удалено: ${oldLesson.discipline.name}`);
            }
          }

          for (const oldLesson of oldLessons) {
            const newLesson = newLessons.find(
              (newL) => newL.discipline.id === oldLesson.discipline.id,
            );

            if (newLesson) {
              const lessonChanges: string[] = [];

              if (oldLesson.teacher?.id !== newLesson.teacher?.id) {
                const oldTeacher = oldLesson.teacher?.name || "не указан";
                const newTeacher = newLesson.teacher?.name || "не указан";
                lessonChanges.push(
                  `преподаватель ${oldTeacher} → ${newTeacher}`,
                );
              }

              if (lessonChanges.length > 0) {
                changes.push(
                  `Изменено ${oldLesson.discipline.name}: ${lessonChanges.join(", ")}`,
                );
              }
            }
          }

          if (changes.length > 0) {
            allChanges.push({
              day: russianDayName,
              changes: changes,
            });
          }
        }
      }

      if (allChanges.length > 0) {
        let message = `В группе ${group.name} изменено расписание:\n\n`;

        for (const change of allChanges) {
          message += `${change.day}:\n${change.changes.map((c) => `- ${c}`).join("\n")}\n\n`;
        }

        message += `Проверьте актуальное расписание в системе.`;

        for (const student of group.students) {
          await this.telegramService.sendNotificationIfEnabled(
            student.id,
            "scheduleChange",
            message,
          );
        }
      }
    }

    if (students) {
      const oldStudentIds = group.students.map((s) => s.id);
      const newStudentIds = students;

      const addedStudents = newStudentIds.filter(
        (id) => !oldStudentIds.includes(id),
      );
      const removedStudents = oldStudentIds.filter(
        (id) => !newStudentIds.includes(id),
      );

      // Уведомления для добавленных участников
      for (const studentId of addedStudents) {
        const student = await this.studentRepository.findOne({
          where: { id: studentId },
        });
        if (student) {
          const welcomeMessage = `Вы добавлены в группу ${group.name}. Теперь у вас есть доступ к чату группы.`;
          await this.telegramService.sendNotificationIfEnabled(
            studentId,
            "studentAddedToGroup",
            welcomeMessage,
          );

          if (group.chat) {
            const chatNotification = `Новый участник ${student.name} добавлен в группу.`;
            await this.sendGroupChangeMessage(
              student,
              chatNotification,
              group.chat.id,
            );
          }
        }
      }

      // Уведомления для удаленных участников
      for (const studentId of removedStudents) {
        const removedMessage = `Вы больше не состоите в группе ${group.name}.`;
        await this.telegramService.sendNotificationIfEnabled(
          studentId,
          "studentRemovedFromGroup",
          removedMessage,
        );
      }
    }

    const teachingTeacherIds = new Set<string>();
    const allTeacherMap = new Map<string, TeacherEntity>();

    for (const day of [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ]) {
      const lessons = schedule?.[day] || [];
      for (const lesson of lessons) {
        const teacher = lesson.teacher;
        if (!teacher?.id) continue;

        teachingTeacherIds.add(teacher.id);

        if (!allTeacherMap.has(teacher.id)) {
          const dbTeacher = await this.teacherRepository.findOne({
            where: { id: teacher.id },
            relations: ["teachingGroups"],
          });
          if (dbTeacher) {
            allTeacherMap.set(teacher.id, dbTeacher);
          }
        }
      }
    }

    for (const teacherId of teachingTeacherIds) {
      const teacher = allTeacherMap.get(teacherId);
      if (!teacher) continue;

      const alreadyInGroup = teacher.teachingGroups?.some(
        (g) => g.id === group.id,
      );
      if (!alreadyInGroup) {
        teacher.teachingGroups = [...(teacher.teachingGroups || []), group];
        await this.teacherRepository.save(teacher);
      }
    }

    // Удаление преподавателей, которых больше нет в группе
    const previousTeachingTeachers = await this.teacherRepository.find({
      where: {
        teachingGroups: { id: group.id },
      },
      relations: ["teachingGroups"],
    });

    for (const prevTeacher of previousTeachingTeachers) {
      if (!teachingTeacherIds.has(prevTeacher.id)) {
        prevTeacher.teachingGroups = prevTeacher.teachingGroups.filter(
          (g) => g.id !== group.id,
        );
        await this.teacherRepository.save(prevTeacher);
      }
    }

    // Обновление состава студентов
    if (students) {
      group.students = await this.studentRepository.findByIds(students);
    }

    // Обновление названия группы
    if (name) {
      group.name = name;
      // Отправка уведомления об изменении названия группы
      const nameChangeMessage = `Название группы изменено с "${group.name}" на "${name}".`;
      for (const student of group.students) {
        await this.telegramService.sendNotificationIfEnabled(
          student.id,
          "groupNameChange",
          nameChangeMessage,
        );
      }
    }

    // Обновление расписания
    if (schedule) {
      group.schedule.monday = await this.processLessons(schedule.monday || []);
      group.schedule.tuesday = await this.processLessons(
        schedule.tuesday || [],
      );
      group.schedule.wednesday = await this.processLessons(
        schedule.wednesday || [],
      );
      group.schedule.thursday = await this.processLessons(
        schedule.thursday || [],
      );
      group.schedule.friday = await this.processLessons(schedule.friday || []);

      await this.scheduleRepository.save(group.schedule);
    }

    return await this.groupRepository.save(group);
  }

  async findAll(options: any = {}): Promise<GroupEntity[]> {
    return await this.groupRepository.find(options);
  }

  async findOne(id: string): Promise<GroupEntity> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ["schedule", "teacher", "students", "chat"],
    });

    if (!group) {
      throw new NotFoundException("Group not found");
    }

    return group;
  }

  async findWithoutTeacher(): Promise<GroupEntity[]> {
    return this.groupRepository
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.teacher", "teacher")
      .where("teacher.id IS NULL")
      .getMany();
  }

  async remove(id: string): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ["teachingTeachers", "students"],
    });

    if (!group) return;

    // Отправка уведомлений о удалении группы
    const removalMessage = `Группа ${group.name} была расформирована.`;
    for (const student of group.students) {
      await this.telegramService.sendNotificationIfEnabled(
        student.id,
        "groupRemoval",
        removalMessage,
      );
    }

    await this.groupRepository
      .createQueryBuilder()
      .relation(GroupEntity, "teachingTeachers")
      .of(id)
      .remove(group.teachingTeachers.map((t) => t.id));

    await this.gradeRepository.delete({ group: { id } });

    await this.groupRepository.delete(id);
  }

  async saveGrades(saveGradesDto: SaveGradesDto): Promise<{ message: string }> {
    const { groupId, grades } = saveGradesDto;

    try {
      const gradeEntitiesToSave: GradeEntity[] = [];
      const gradeUpdates: {
        studentId: string;
        discipline: string;
        oldGrade: string | null;
        newGrade: string;
        date: Date;
      }[] = [];
      const newGrades: {
        studentId: string;
        discipline: string;
        grade: string;
        date: Date;
      }[] = [];

      for (const disciplineId in grades) {
        if (
          !grades.hasOwnProperty(disciplineId) ||
          typeof grades[disciplineId] !== "object"
        )
          continue;

        const discipline = await this.disciplineRepository.findOne({
          where: { id: disciplineId },
        });
        if (!discipline) continue;

        const disciplineGrades = grades[disciplineId];
        for (const dateString in disciplineGrades) {
          const date = moment(dateString, "YYYY-MM-DD").toDate();
          const studentGrades = disciplineGrades[dateString];

          for (const studentId in studentGrades) {
            const gradeValue = studentGrades[studentId];

            const existing = await this.gradeRepository.findOne({
              where: {
                group: { id: groupId },
                student: { id: studentId },
                discipline: { id: disciplineId },
                date,
              },
              relations: ["discipline"],
            });

            if (existing) {
              if (existing.grade !== gradeValue) {
                gradeUpdates.push({
                  studentId,
                  discipline: discipline.name,
                  oldGrade: existing.grade,
                  newGrade: gradeValue,
                  date,
                });
                existing.grade = gradeValue;
                gradeEntitiesToSave.push(existing);
              }
            } else {
              newGrades.push({
                studentId,
                discipline: discipline.name,
                grade: gradeValue,
                date,
              });
              const newGrade = this.gradeRepository.create({
                group: { id: groupId },
                student: { id: studentId },
                discipline: { id: disciplineId },
                date,
                grade: gradeValue,
              });
              gradeEntitiesToSave.push(newGrade);
            }
          }
        }
      }

      if (gradeEntitiesToSave.length > 0) {
        await this.gradeRepository.save(gradeEntitiesToSave);
      }

      for (const update of gradeUpdates) {
        const formattedDate = moment(update.date).format("DD.MM.YYYY");
        const message = `Ваша оценка по дисциплине "${
          update.discipline
        }" за ${formattedDate} была изменена: с ${update.oldGrade || "не указано"} на ${
          update.newGrade
        }.`;

        await this.telegramService.sendNotificationIfEnabled(
          update.studentId,
          "gradeUpdate",
          message,
        );
      }

      for (const newGrade of newGrades) {
        const formattedDate = moment(newGrade.date).format("DD.MM.YYYY");
        const message = `Вам выставлена новая оценка по дисциплине "${newGrade.discipline}": ${newGrade.grade} за ${formattedDate}.`;

        await this.telegramService.sendNotificationIfEnabled(
          newGrade.studentId,
          "newGrade",
          message,
        );
      }

      return { message: "Grades saved successfully" };
    } catch (error) {
      console.error("Error saving grades:", error);
      throw error;
    }
  }

  async getGrades(
    groupId: string,
    weekStart: string,
  ): Promise<DisciplineGrades> {
    const startDate = moment(weekStart).toDate();
    const endDate = moment(weekStart).add(6, "days").toDate();

    try {
      const grades = await this.gradeRepository.find({
        where: {
          group: { id: groupId },
          date: Between(startDate, endDate),
        },
        relations: ["student", "discipline"],
      });

      const formattedGrades: DisciplineGrades = {};

      grades.forEach((grade) => {
        const disciplineId = grade.discipline.id;
        const dateStr = moment(grade.date).format("YYYY-MM-DD");
        const studentId = grade.student.id;

        if (!formattedGrades[disciplineId]) {
          formattedGrades[disciplineId] = {};
        }
        if (!formattedGrades[disciplineId][dateStr]) {
          formattedGrades[disciplineId][dateStr] = <string>{};
        }

        formattedGrades[disciplineId][dateStr][studentId] = grade.grade;
      });

      return formattedGrades;
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  }

  private async processLessons(lessons: any[]): Promise<Lesson[]> {
    return Promise.all(
      lessons.map(async (lessonDto) => {
        const teacherEntity = await this.teacherRepository.findOne({
          where: { id: lessonDto.teacher.id },
        });

        const disciplineEntity = await this.disciplineRepository.findOne({
          where: { id: lessonDto.discipline.id },
        });

        if (!teacherEntity) {
          throw new NotFoundException(
            `Teacher with ID ${lessonDto.teacherId} not found`,
          );
        }

        if (!disciplineEntity) {
          throw new NotFoundException(
            `Discipline with ID ${lessonDto.discipline} not found`,
          );
        }

        return {
          ...lessonDto,
          discipline: disciplineEntity,
          teacher: teacherEntity,
        } as Lesson;
      }),
    );
  }

  async getGroupGradesGroupedByDisciplines(groupId: string): Promise<
    | {
        studentId: string;
        studentName: string;
        disciplines: {
          discipline: string;
          grades: { id: string; grade: string; date: Date }[];
        }[];
      }[]
    | null
  > {
    const grades = await this.gradeRepository
      .createQueryBuilder("grade")
      .leftJoinAndSelect("grade.discipline", "discipline")
      .leftJoinAndSelect("grade.student", "student")
      .leftJoin("student.group", "group")
      .where("group.id = :groupId", { groupId })
      .select([
        "grade.id",
        "grade.grade",
        "grade.date",
        "discipline.name",
        "student.id",
        "student.name",
      ])
      .getMany();

    if (!grades.length) {
      return null;
    }

    const studentsMap = new Map<
      string,
      {
        studentId: string;
        studentName: string;
        disciplines: {
          [discipline: string]: { id: string; grade: string; date: Date }[];
        };
      }
    >();

    for (const grade of grades) {
      const studentId = grade.student.id;
      const studentName = grade.student.name;

      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          studentId,
          studentName,
          disciplines: {},
        });
      }

      const studentData = studentsMap.get(studentId)!;
      const disciplineName = grade.discipline.name;

      if (!studentData.disciplines[disciplineName]) {
        studentData.disciplines[disciplineName] = [];
      }

      studentData.disciplines[disciplineName].push({
        id: grade.id,
        grade: grade.grade,
        date: grade.date,
      });
    }

    return Array.from(studentsMap.values()).map((student) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      disciplines: Object.entries(student.disciplines).map(
        ([discipline, grades]) => ({
          discipline,
          grades,
        }),
      ),
    }));
  }
}
