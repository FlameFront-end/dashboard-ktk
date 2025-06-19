import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { TelegramBotEntity } from "./bot.entity";

@Entity("notification-settings")
export class TelegramNotificationSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  scheduleChange: boolean;

  @Column({ default: false })
  gradeUpdate: boolean;

  @Column({ default: false })
  newGrade: boolean;

  @Column({ default: false })
  newStudent: boolean;

  @Column({ default: false })
  newMessage: boolean;

  @Column({ default: false })
  groupCreation: boolean;

  @Column({ default: false })
  studentAddedToGroup: boolean;

  @Column({ default: false })
  studentRemovedFromGroup: boolean;

  @Column({ default: false })
  groupNameChange: boolean;

  @Column({ default: false })
  groupRemoval: boolean;

  @Column({ default: false })
  newLesson: boolean;

  @Column({ default: false })
  lessonUpdate: boolean;

  @Column({ default: false })
  lessonRemoved: boolean;

  @OneToOne(() => TelegramBotEntity, (bot) => bot.settings)
  @JoinColumn()
  bot: TelegramBotEntity;
}
