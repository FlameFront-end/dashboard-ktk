import { lessonsPaths } from './lessons.paths.ts'
import Lessons from '../pages/Lessons'
import CreateLesson from '../pages/CreateLesson'
import EditLesson from '../pages/EditLesson'

export const lessonsRoutes = [
    {
        path: lessonsPaths.lessons,
        element: <Lessons/>
    },
    {
        path: lessonsPaths.create_lesson,
        element: <CreateLesson/>
    },
    {
        path: lessonsPaths.edit_lesson,
        element: <EditLesson/>
    }
]
