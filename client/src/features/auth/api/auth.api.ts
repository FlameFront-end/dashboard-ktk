import { api } from '@/core'

export const authApi = api.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: payload => ({
				url: '/auth/login',
				method: 'POST',
				body: payload
			})
		})
	})
})

export const { useLoginMutation } = authApi
