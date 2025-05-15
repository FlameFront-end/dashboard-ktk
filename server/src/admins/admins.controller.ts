import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request
} from '@nestjs/common'
import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { AdminEntity } from './entities/admin.entity'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('admins')
@Controller('admins')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminsController {
	constructor(private readonly adminsService: AdminsService) {}

	@Post()
	@Roles('admin')
	@ApiBody({ type: CreateAdminDto })
	async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminEntity> {
		return this.adminsService.create(createAdminDto)
	}

	@Get()
	async getAll(): Promise<AdminEntity[]> {
		return this.adminsService.findAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string): Promise<AdminEntity> {
		return this.adminsService.findOne(id)
	}

	@Patch(':id')
	@Roles('admin')
	async update(
		@Param('id') id: string,
		@Body() updateAdminDto: UpdateAdminDto
	): Promise<AdminEntity> {
		return this.adminsService.update(id, updateAdminDto)
	}

	@Delete(':id')
	@Roles('admin')
	async delete(@Param('id') id: string): Promise<{ message: string }> {
		await this.adminsService.delete(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
