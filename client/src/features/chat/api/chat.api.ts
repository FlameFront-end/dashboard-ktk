import { api } from '@/core'

export const chatApi = api.injectEndpoints({
	endpoints: builder => ({
		getChatByGroupId: builder.query<Collections.Chat, string>({
			query: groupId => ({
				url: `/chat/${groupId}`,
				method: 'GET'
			})
		})
	})
})

export const { useGetChatByGroupIdQuery } = chatApi
