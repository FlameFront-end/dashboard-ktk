import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: '' })
	password: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: '' })
	email: string
}
