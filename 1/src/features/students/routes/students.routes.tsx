import { studentsPaths } from './students.paths.ts'
import StudentsList from '../pages/StudentsList'

export const studentsRoutes = [
    {
        path: studentsPaths.students_list,
        element: <StudentsList/>
    }
]
