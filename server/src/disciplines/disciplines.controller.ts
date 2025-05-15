import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch, UseGuards
} from '@nestjs/common'
import { DisciplinesService } from './disciplines.service'
import { CreateDisciplineDto } from './dto/create-discipline.dto'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { UpdateDisciplineDto } from './dto/update-discipline.dto'
import { DisciplineEntity } from './entities/discipline.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('disciplines')
@Controller('disciplines')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisciplinesController {
	constructor(private readonly disciplinesService: DisciplinesService) {}

	@Post()
	@Roles('admin')
	@ApiBody({ type: CreateDisciplineDto })
	create(@Body() createDisciplineDto: CreateDisciplineDto) {
		return this.disciplinesService.create(createDisciplineDto)
	}

	@Get()
	@Roles('admin')
	findAll() {
		return this.disciplinesService.findAll()
	}

	@Get(':id')
	@Roles('admin')
	findOne(@Param('id') id: string) {
		return this.disciplinesService.findOne(id)
	}

	@Delete(':id')
	@Roles('admin')
	remove(@Param('id') id: string) {
		return this.disciplinesService.remove(id)
	}

	@Patch(':id')
	@Roles('admin')
	async update(
		@Param('id') id: string,
		@Body() updateDisciplineDto: UpdateDisciplineDto
	): Promise<DisciplineEntity> {
		return this.disciplinesService.update(id, updateDisciplineDto)
	}
}
