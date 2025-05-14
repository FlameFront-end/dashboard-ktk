import { api } from '@/core'

interface CreateGradePayload {
    grades: any
    groupId: string
    weekStart: string
}

export const performanceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createGrade: builder.mutation<any, CreateGradePayload>({
            query: (body) => ({
                url: '/groups/grades',
                method: 'POST',
                body
            })
        }),
        getAllGradesFromStudent: builder.query<Collections.StudentGrades, string>({
            query: (id) => ({
                url: `/students/${id}/grades`
            })
        })

    })
})

export const {
    useCreateGradeMutation,
    useGetAllGradesFromStudentQuery
} = performanceApi
