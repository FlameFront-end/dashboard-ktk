import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentEntity } from "./entities/student.entity";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("students")
@Controller("students")
@ApiBearerAuth("jwt")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles("admin", "teacher")
  @ApiBody({ type: CreateStudentDto })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentEntity> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async getAll(): Promise<StudentEntity[]> {
    return this.studentsService.findAll();
  }

  @Get("without-group")
  async getStudentsWithoutGroup(): Promise<StudentEntity[]> {
    return this.studentsService.findWithoutGroup();
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<StudentEntity> {
    return this.studentsService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "teacher")
  async update(
    @Param("id") id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(":id")
  @Roles("admin", "teacher")
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    await this.studentsService.delete(id);
    return { message: `Teacher with ID ${id} deleted successfully` };
  }

  @Delete(":id/group")
  @Roles("admin", "teacher")
  async removeFromGroup(@Param("id") id: string): Promise<{ message: string }> {
    await this.studentsService.removeFromGroup(id);
    return {
      message: `Student with ID ${id} removed from group successfully.`,
    };
  }

  @Get(":id/grades")
  @ApiOperation({
    summary: "Get all grades of a student grouped by disciplines",
  })
  async getStudentGradesGroupedByDisciplines(
    @Param("id") studentId: string,
  ): Promise<any> {
    return this.studentsService.getStudentGradesGroupedByDisciplines(studentId);
  }
}
