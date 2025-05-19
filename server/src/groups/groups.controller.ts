import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DisciplineGrades, GroupsService } from "./groups.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { SaveGradesDto } from "./dto/save-grades.dto";
import { GroupEntity } from "./entities/group.entity";
import { WithSchedule } from "./decorators/with-schedule.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("groups")
@Controller("groups")
@ApiBearerAuth("jwt")
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @Roles("admin", "teacher")
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto);
  }

  @Get()
  async findAll(@WithSchedule() withSchedule: boolean): Promise<GroupEntity[]> {
    const options = withSchedule
      ? { relations: ["schedule", "teacher", "students"] }
      : { relations: ["schedule", "teacher", "students"] };

    return await this.groupsService.findAll(options);
  }

  @Get("without-teacher")
  async findGroupsWithoutTeacher() {
    return await this.groupsService.findWithoutTeacher();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.groupsService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "teacher")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.update(id, updateGroupDto);
  }

  @Delete(":id")
  @Roles("admin")
  async remove(@Param("id") id: string) {
    await this.groupsService.remove(id);
  }

  @Post("/grades")
  @Roles("admin", "teacher")
  async saveGrades(@Body() saveGradesDto: SaveGradesDto) {
    return this.groupsService.saveGrades(saveGradesDto);
  }

  @Get(":groupId/grades")
  async getGrades(
    @Param("groupId") groupId: string,
    @Query("weekStart") weekStart: string,
  ): Promise<DisciplineGrades> {
    return this.groupsService.getGrades(groupId, weekStart);
  }

  @Get(":groupId/grades-by-disciplines")
  async getAllStudentGradesGroupedByDisciplines(
    @Param("groupId") groupId: string,
  ) {
    return await this.groupsService.getGroupGradesGroupedByDisciplines(groupId);
  }
}
