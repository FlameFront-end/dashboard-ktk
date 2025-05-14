import RouterProtect from '../RouterProtect.tsx'
import NotFound404 from '../../pages/NotFound404'
import Layout from '../../containers/Layout'
import { pathsConfig } from '@/pathsConfig'
import { authRoutes } from '../../features/auth/routes/auth.routes.tsx'
import { groupsRoutes } from '../../features/groups/routes/groups.routes.tsx'
import { studentsRoutes } from '../../features/students/routes/students.routes.tsx'
import { teachersRoutes } from '../../features/teachers/routes/teachers.routes.tsx'
import { lessonsRoutes } from '../../features/lessons/routes/lessons.routes.tsx'
import { disciplinesRoutes } from '../../features/disciplines/routes/disciplines.routes.tsx'
import { adminsRoutes } from '../../features/admins/routes/admins.routes.tsx'
import { chatRoutes } from '../../features/chat/routes/chat.routes.tsx'
import { performanceRoutes } from '../../features/performance/routes/performance.routes.tsx'
import { supportRoutes } from '../../features/support/routes/support.routes.tsx'
import { classRegisterRoutes } from '../../features/classRegister/routes/classRegister.routes.tsx'

export const routesConfig = [
	{
		element: <RouterProtect />,
		errorElement: <NotFound404 />,
		children: [
			{
				path: pathsConfig.root,
				element: <Layout />,
				children: [
					...groupsRoutes,
					...studentsRoutes,
					...teachersRoutes,
					...lessonsRoutes,
					...disciplinesRoutes,
					...adminsRoutes,
					...chatRoutes,
					...performanceRoutes,
					...supportRoutes,
					...classRegisterRoutes
				]
			},
			...authRoutes
		]
	}
]
