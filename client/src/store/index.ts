import { api } from '@/core'
import { authActions, authReducer } from '../features/auth/store/auth.slice'
import { chatReducer } from '../features/chat/store/chat.slice.ts'

export const reducers = {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    chat: chatReducer
}

export const actions = {
    ...authActions
}
