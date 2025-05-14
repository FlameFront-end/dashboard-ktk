import { groupsPaths } from './groups.paths.ts'
import GroupList from '../pages/GroupList'
import Group from '../pages/Group'
import CreateGroup from '../pages/CreateGroup'
import EditGroup from '../pages/EditGroup'
import CreateLesson from '../../lessons/pages/CreateLesson'
import Lessons from '../../lessons/pages/Lessons'

export const groupsRoutes = [
    {
        path: groupsPaths.group_list,
        element: <GroupList/>
    },
    {
        path: groupsPaths.group,
        element: <Group/>
    },
    {
        path: groupsPaths.create_group,
        element: <CreateGroup/>
    },
    {
        path: groupsPaths.edit_group,
        element: <EditGroup/>
    },
    {
        path: groupsPaths.lessons,
        element: <Lessons/>
    },
    {
        path: groupsPaths.create_lesson,
        element: <CreateLesson/>
    }
]
