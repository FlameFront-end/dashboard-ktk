import { api } from '@/core'

export interface CreateTicketPayload {
	userId: string
	message: string
	userType: 'student' | 'teacher' | 'admin'
}

export const supportApi = api.injectEndpoints({
	endpoints: builder => ({
		createTicket: builder.mutation<void, CreateTicketPayload>({
			query: ticket => ({
				url: '/support/ticket',
				method: 'POST',
				body: ticket
			})
		}),
		getAllTickets: builder.query<any, void>({
			query: () => ({
				url: '/support/tickets'
			})
		})
	})
})

export const { useCreateTicketMutation, useGetAllTicketsQuery } = supportApi
