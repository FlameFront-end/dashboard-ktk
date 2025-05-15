import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ChatEntity } from './entities/chat.entity'

@ApiTags('chat')
@Controller('chat')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async getAll(): Promise<ChatEntity[]> {
		return this.chatService.findAll()
	}

	@Get('/:groupId')
	async getChatByGroupId(@Param('groupId') groupId: string) {
		return await this.chatService.getChatByGroupId(groupId)
	}
}
