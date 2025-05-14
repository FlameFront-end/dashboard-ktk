import { useMemo } from 'react'
import { useAppAction, useAppSelector } from '@/hooks'

interface UseAuthReturn {
    isAuth: boolean
    logout: () => void
}

export const useAuth = (): UseAuthReturn => {
    const isAuth = useAppSelector(state => state.auth.user.isAuth)
    const { removeUser } = useAppAction()

    const logout = (): void => {
        removeUser()
        localStorage.clear()
        location.reload()
    }

    return useMemo(() => ({ isAuth, logout }), [isAuth])
}
