import { api } from '@/core'

export const disciplinesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDiscipline: builder.mutation<Collections.Discipline, { name: string }>({
            query: (body) => ({
                url: '/disciplines',
                method: 'POST',
                body
            })
        }),
        getAllDisciplines: builder.query<Collections.Discipline[], void>({
            query: () => ({
                url: '/disciplines',
                method: 'GET'
            })
        }),
        getDisciplineById: builder.query<Collections.Discipline, string>({
            query: (id) => ({
                url: `/disciplines/${id}`,
                method: 'GET'
            })
        }),
        deleteDiscipline: builder.mutation<void, string>({
            query: (id) => ({
                url: `/disciplines/${id}`,
                method: 'DELETE'
            })
        }),
        updateDiscipline: builder.mutation<Collections.Discipline, { id: string, name: string }>({
            query: ({ id, name }) => ({
                url: `/disciplines/${id}`,
                method: 'PATCH',
                body: {
                    name
                }
            })
        })
    })
})

export const {
    useCreateDisciplineMutation,
    useGetAllDisciplinesQuery,
    useLazyGetDisciplineByIdQuery,
    useDeleteDisciplineMutation,
    useUpdateDisciplineMutation
} = disciplinesApi
