import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { StyledContent, StyledLayout } from './Layout.styled'
import { Header, Sidebar } from '@/components'
import { useAppSelector } from '@/hooks'

const Layout = () => {
	const user = useAppSelector(state => state.auth.user)
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

	const handleToggleSidebar = (): void => {
		setMobileSidebarOpen(prev => !prev)
	}
	const closeSidebar = (): void => {
		setMobileSidebarOpen(false)
	}

	return (
		<>
			{!!user.role && <Header onBurgerClick={handleToggleSidebar} />}

			<StyledLayout hasSider>
				<Sidebar
					closeMobileSidebar={closeSidebar}
					mobileSidebarOpen={mobileSidebarOpen}
				/>

				<StyledContent>
					<Outlet />
				</StyledContent>
			</StyledLayout>
		</>
	)
}

export default Layout
