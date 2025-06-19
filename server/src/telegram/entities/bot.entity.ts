import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { StudentEntity } from "../../students/entities/student.entity";
import { TelegramNotificationSettingsEntity } from "./notification-settings.entity";

@Entity("bot")
export class TelegramBotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  chatId: number;

  @OneToOne(() => StudentEntity, (student) => student.telegramBot)
  @JoinColumn()
  student: StudentEntity;

  @OneToOne(
    () => TelegramNotificationSettingsEntity,
    (settings) => settings.bot,
    {
      cascade: true,
    },
  )
  settings: TelegramNotificationSettingsEntity;
}
