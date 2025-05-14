import { classRegisterPaths } from './classRegister.paths.ts'
import ClassRegister from '../pages/ClassRegister'

export const classRegisterRoutes = [
	{
		path: classRegisterPaths.class_register,
		element: <ClassRegister />
	}
]
