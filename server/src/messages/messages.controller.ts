import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { MessagesService } from './messages.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get('/:chatId')
	async getChatMessagesById(@Param('chatId') chatId: string) {
		return await this.messagesService.getAllMessages(chatId)
	}
}
