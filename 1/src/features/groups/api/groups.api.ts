import { api } from '@/core'

export interface CreateGroupPayload {
    name: string
    teacher: string
    students: string[]
    schedule: Omit<Collections.Schedule, 'id'>
}

export interface UpdateGroupPayload {
    id: string
    name: string
    teacher: string
    students: string[]
    schedule: Omit<Collections.Schedule, 'id'>
}

export const groupsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllGroups: builder.query<Collections.Group[], boolean>({
            query: (withSchedule) => `/groups?withSchedule=${withSchedule.toString()}`
        }),
        getAllGroupsWithoutTeacher: builder.query<Collections.Group[], void>({
            query: () => '/groups/without-teacher'
        }),
        getGroup: builder.query<Collections.Group, string>({
            query: (id) => `/groups/${id}`
        }),
        createGroup: builder.mutation<Collections.Group, CreateGroupPayload>({
            query: (body) => ({
                url: '/groups',
                method: 'POST',
                body
            })
        }),
        updateGroup: builder.mutation<Collections.Group, UpdateGroupPayload>({
            query: ({ id, ...body }) => ({
                url: `/groups/${id}`,
                method: 'PATCH',
                body
            })
        }),
        deleteGroup: builder.mutation<void, string>({
            query: (id) => ({
                url: `/groups/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {
    useGetAllGroupsQuery,
    useGetAllGroupsWithoutTeacherQuery,
    useGetGroupQuery,
    useCreateGroupMutation,
    useDeleteGroupMutation,
    useUpdateGroupMutation
} = groupsApi
