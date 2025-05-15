import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '@/core'

interface ChatState {
	messages: Collections.Message[]
}

const initialState: ChatState = {
	messages: []
}

export const fetchChatInfo = createAsyncThunk(
	'chat/fetchChatInfo',
	async ({ chatId }: { chatId: string }) => {
		const response = await axiosInstance.get(`/messages/${chatId}`)
		return response.data
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload)
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchChatInfo.fulfilled, (state, action) => {
			state.messages = action.payload
		})
	}
})

export const { reducer: chatReducer, actions: chatActions } = chatSlice
