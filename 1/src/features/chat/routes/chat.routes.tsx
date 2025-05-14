import { chatPaths } from './chat.paths.ts'
import Login from '../pages/Chat'

export const chatRoutes = [
    {
        path: chatPaths.chat,
        element: <Login />
    }
]
