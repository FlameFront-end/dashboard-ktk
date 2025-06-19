import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyTokenDto {
  @ApiProperty({
    description: "Telegram verification token",
    example: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  })
  @IsString()
  token: string;
}
