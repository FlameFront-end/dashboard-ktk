import { adminsPaths } from './admins.paths.ts'
import AdminsList from '../pages/AdminsList'

export const adminsRoutes = [
    {
        path: adminsPaths.admins_list,
        element: <AdminsList/>
    }
]
