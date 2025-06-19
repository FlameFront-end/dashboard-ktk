import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class TelegramSettingsDto {
  @ApiProperty({
    description: "Telegram bot authentication token",
    example: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: true,
    default: false,
  })
  @IsBoolean()
  scheduleChange: boolean;

  @ApiProperty({
    description: "Enable notifications for new messages",
    example: true,
    default: false,
  })
  @IsBoolean()
  newMessage: boolean;

  @ApiProperty({
    description: "Enable notifications for grade updates",
    example: true,
    default: false,
  })
  @IsBoolean()
  gradeUpdate: boolean;

  @ApiProperty({
    description: "Enable notifications for new grades",
    example: true,
    default: false,
  })
  @IsBoolean()
  newGrade: boolean;

  @ApiProperty({
    description: "Enable notifications for new students",
    example: false,
    default: false,
  })
  @IsBoolean()
  newStudent: boolean;

  @ApiProperty({
    description: "Enable notifications for group creation",
    example: false,
    default: false,
  })
  @IsBoolean()
  groupCreation: boolean;

  @ApiProperty({
    description: "Enable notifications when student added to group",
    example: false,
    default: false,
  })
  @IsBoolean()
  studentAddedToGroup: boolean;

  @ApiProperty({
    description: "Enable notifications when student removed from group",
    example: false,
    default: false,
  })
  @IsBoolean()
  studentRemovedFromGroup: boolean;

  @ApiProperty({
    description: "Enable notifications for group name changes",
    example: false,
    default: false,
  })
  @IsBoolean()
  groupNameChange: boolean;

  @ApiProperty({
    description: "Enable notifications for group removal",
    example: false,
    default: false,
  })
  @IsBoolean()
  groupRemoval: boolean;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  newLesson: boolean;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  lessonUpdate: boolean;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  lessonRemoved: boolean;
}
