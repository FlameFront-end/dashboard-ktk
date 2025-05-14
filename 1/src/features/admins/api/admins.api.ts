import { api } from '@/core'

export interface AdminCreatePayload {
    name: string
    email: string
    phone?: string
}

export interface AdminUpdatePayload {
    id: string
    name: string
    email: string
    phone?: string
}

export const adminsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createAdmin: builder.mutation<Collections.Teacher, AdminCreatePayload>({
            query: (teacher) => ({
                url: '/admins',
                method: 'POST',
                body: teacher
            })
        }),
        getAllAdmins: builder.query<Collections.Teacher[], void>({
            query: () => ({
                url: '/admins',
                method: 'GET'
            })
        }),
        getAdminById: builder.query<Collections.Teacher, string>({
            query: (id) => ({
                url: `/admins/${id}`,
                method: 'GET'
            })
        }),
        deleteAdmin: builder.mutation<void, string>({
            query: (id) => ({
                url: `/admins/${id}`,
                method: 'DELETE'
            })
        }),
        updateAdmin: builder.mutation<Collections.Teacher, AdminUpdatePayload >({
            query: ({ id, ...data }) => ({
                url: `/admins/${id}`,
                method: 'PATCH',
                body: data
            })
        })
    })
})

export const {
    useCreateAdminMutation,
    useGetAllAdminsQuery,
    useGetAdminByIdQuery,
    useUpdateAdminMutation,
    useDeleteAdminMutation
} = adminsApi
