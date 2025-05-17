import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { AuthModule } from './auth/auth.module'
import { MailModule } from './mail/mail.module'
import { TeachersModule } from './teachers/teachers.module'
import { StudentsModule } from './students/students.module'
import { GroupsModule } from './groups/groups.module'
import { AdminsModule } from './admins/admins.module'
import { DisciplinesModule } from './disciplines/disciplines.module'
import { LessonsModule } from './lessons/lessons.module'
import { ChatModule } from './chat/chat.module'
import { MessagesModule } from './messages/messages.module'
import { SupportModule } from './support-ticket/support.module'
import { TelegramModule } from './telegram/telegram.module'

import { TeacherEntity } from './teachers/entities/teacher.entity'
import { StudentEntity } from './students/entities/student.entity'
import { GroupEntity } from './groups/entities/group.entity'
import { ScheduleEntity } from './groups/entities/schedule.entity'
import { GradeEntity } from './groups/entities/grade.entity'
import { AdminEntity } from './admins/entities/admin.entity'
import { DisciplineEntity } from './disciplines/entities/discipline.entity'
import { LessonEntity } from './lessons/entities/lesson.entity'
import { MessageEntity } from './messages/entities/message.entity'
import { ChatEntity } from './chat/entities/chat.entity'
import { SupportTicketEntity } from './support-ticket/entities/support-ticket.entity'

const ENTITIES = [
	TeacherEntity,
	StudentEntity,
	GroupEntity,
	ScheduleEntity,
	GradeEntity,
	AdminEntity,
	DisciplineEntity,
	LessonEntity,
	MessageEntity,
	ChatEntity,
	SupportTicketEntity
]

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
			isGlobal: true
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: ENTITIES,
			synchronize: true,
			ssl: false
		}),
		TypeOrmModule.forFeature(ENTITIES),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService]
		}),

		AuthModule,
		MailModule,
		TeachersModule,
		StudentsModule,
		GroupsModule,
		AdminsModule,
		DisciplinesModule,
		LessonsModule,
		ChatModule,
		MessagesModule,
		SupportModule,
		TelegramModule
	]
})
export class AppModule {}
