import { authPaths } from './auth.paths'
import Login from '../pages/Login'

export const authRoutes = [
    {
        path: authPaths.login,
        element: <Login />
    }
]
