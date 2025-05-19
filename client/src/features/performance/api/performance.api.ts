import { api } from '@/core'

interface CreateGradePayload {
	grades: any
	groupId: string
	weekStart: string
}

export const performanceApi = api.injectEndpoints({
	endpoints: builder => ({
		createGrade: builder.mutation<any, CreateGradePayload>({
			query: body => ({
				url: '/groups/grades',
				method: 'POST',
				body
			})
		}),
		getAllGradesFromStudent: builder.query<
			Collections.StudentGrades,
			string
		>({
			query: studentId => ({
				url: `/students/${studentId}/grades`
			})
		}),
		getAllGradesFromGroup: builder.query<Collections.GroupGrades, string>({
			query: groupId => ({
				url: `/groups/${groupId}/grades-by-disciplines`
			})
		})
	})
})

export const {
	useCreateGradeMutation,
	useGetAllGradesFromStudentQuery,
	useGetAllGradesFromGroupQuery
} = performanceApi
