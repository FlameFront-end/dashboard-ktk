import { type FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FloatButton } from 'antd'
import { useAuth } from '../features/auth/hooks/useAuth'
import MobileNavBottom from '../components/MobileNavBottom'
import { useAppSelector } from '@/hooks'
import { pathsConfig } from '@/pathsConfig'

const RouterProtect: FC = () => {
    const { isAuth } = useAuth()
    const { pathname } = useLocation()

    const user = useAppSelector(state => state.auth.user)

    if (!isAuth && (pathname !== pathsConfig.login)) {
        return <Navigate to={pathsConfig.login} replace />
    }

    if (isAuth && (pathname === pathsConfig.login)) {
        return <Navigate to={pathsConfig.group_list} replace state={{ userId: user.id }} />
    }

    return (
        <>
            <Outlet />
            <FloatButton.BackTop />
            <MobileNavBottom/>
        </>
    )
}

export default RouterProtect
