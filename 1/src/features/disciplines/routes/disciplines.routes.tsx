import { disciplinesPaths } from './disciplines.paths.ts'
import Disciplines from '../pages'

export const disciplinesRoutes = [
    {
        path: disciplinesPaths.disciplines,
        element: <Disciplines />
    }
]
