import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { SupportService } from './support.service'
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('support')
@ApiTags('support')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class SupportController {
	constructor(private readonly supportService: SupportService) {}

	@Post('ticket')
	@ApiBody({ type: CreateSupportTicketDto })
	create(@Body() dto: CreateSupportTicketDto) {
		return this.supportService.createTicket(dto)
	}

	@Get('tickets')
	getAll() {
		return this.supportService.getAllTickets()
	}
}
