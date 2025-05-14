import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import type { LoginResponse } from '../types/login.types'

interface AuthState {
    user: {
        isAuth: boolean
        token: string | undefined | null
        id: string | undefined
        email: string | undefined
        name: string | undefined
        role: 'teacher' | 'student' | 'admin' | undefined
        groupId: string | null | undefined
    }
}

const user = JSON.parse(Cookies.get('user') ?? '{}') as {
    token?: string
    id?: string
    email?: string
    name?: string
    role?: 'teacher' | 'student' | 'admin'
    groupId?: string | null
}

const initialState: AuthState = {
    user: {
        isAuth: user?.token != null,
        token: user?.token,
        id: user?.id,
        name: user?.name,
        role: user?.role,
        email: user?.email,
        groupId: user?.groupId
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, { payload }: PayloadAction<LoginResponse>) {
            Cookies.set('token', payload.token)
            Cookies.set('user', JSON.stringify(payload))

            state.user = {
                ...payload,
                isAuth: true
            }
        },
        removeUser(state) {
            Cookies.remove('token')
            Cookies.remove('user')

            state.user.isAuth = false
            state.user.token = null
            state.user.id = undefined
            state.user.name = undefined
            state.user.email = undefined
            state.user.role = undefined
            state.user.groupId = undefined
        }
    }
})

export const { reducer: authReducer, actions: authActions } = authSlice
