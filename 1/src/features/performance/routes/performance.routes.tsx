import { performancePaths } from './performance.paths.ts'
import GroupPerformance from '../pages/GroupPerformance'
import IndividualPerformance from '../pages/IndividualPerformance'

export const performanceRoutes = [
    {
        path: performancePaths.group_performance,
        element: <GroupPerformance/>
    },
    {
        path: performancePaths.individual_performance,
        element: <IndividualPerformance/>
    }
]
