import { type FC } from 'react'
import { Outlet } from 'react-router-dom'
import { StyledContent, StyledLayout } from './Layout.styled.tsx'
import { Header, Sidebar } from '@/components'
import { useAppSelector } from '@/hooks'

const Layout: FC = () => {
    const user = useAppSelector(state => state.auth.user)

    return (
        <>
            {!!user.role && (
                <Header/>
            )}

            <StyledLayout hasSider>
                <Sidebar />
                <StyledContent>
                    <Outlet />
                </StyledContent>
            </StyledLayout>
        </>

    )
}

export default Layout
