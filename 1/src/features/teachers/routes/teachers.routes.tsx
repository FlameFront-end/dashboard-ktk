import { teachersPaths } from './teachers.paths.ts'
import TeachersList from '../pages/TeachersList'

export const teachersRoutes = [
    {
        path: teachersPaths.teachers_list,
        element: <TeachersList/>
    }
]
