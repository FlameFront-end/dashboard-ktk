import { api } from '@/core'

interface CreateLessonPayload extends FormData {}
interface EditLessonPayload extends FormData {}

interface GetALlLessonsRequest {
	groupId: string
	disciplineId: string
}

export const lessonsApi = api.injectEndpoints({
	endpoints: builder => ({
		createLessons: builder.mutation<any, CreateLessonPayload>({
			query: body => ({
				url: '/lessons',
				method: 'POST',
				body
			})
		}),
		editLesson: builder.mutation<any, EditLessonPayload>({
			query: body => {
				const id = body.get('id')
				return {
					url: `/lessons/${typeof id === 'string' ? id : ''}`,
					method: 'PATCH',
					body
				}
			}
		}),
		getLesson: builder.query<Collections.Lesson, string>({
			query: lessonId => ({
				url: `/lessons/${lessonId}`
			})
		}),
		getALlLessons: builder.query<
			Collections.Lesson[],
			GetALlLessonsRequest
		>({
			query: ({ groupId, disciplineId }) => ({
				url: `/lessons/${groupId}/${disciplineId}`
			})
		})
	})
})

export const {
	useCreateLessonsMutation,
	useEditLessonMutation,
	useGetLessonQuery,
	useGetALlLessonsQuery
} = lessonsApi
