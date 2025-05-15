import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	Patch, UseGuards
} from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('teachers')
@Controller('teachers')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
	constructor(private readonly teachersService: TeachersService) {}

	@Post()
	@Roles('admin')
	@ApiBody({ type: CreateTeacherDto })
	async create(
		@Body() createTeacherDto: CreateTeacherDto
	): Promise<TeacherEntity> {
		return this.teachersService.create(createTeacherDto)
	}

	@Get()
	async findAll(): Promise<TeacherEntity[]> {
		return this.teachersService.findAll()
	}

	@Get('without-group')
	async findTeachersWithoutGroup() {
		return this.teachersService.findWithoutGroup()
	}

	@Get(':id')
	async find(@Param('id') id: string): Promise<TeacherEntity> {
		return this.teachersService.find(id)
	}

	@Patch(':id')
	@Roles('admin')
	async update(
		@Param('id') id: string,
		@Body() updateTeacherDto: UpdateTeacherDto
	): Promise<TeacherEntity> {
		return this.teachersService.update(id, updateTeacherDto)
	}

	@Delete(':id')
	@Roles('admin')
	async deleteTeacherById(
		@Param('id') id: string
	): Promise<{ message: string }> {
		await this.teachersService.delete(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
