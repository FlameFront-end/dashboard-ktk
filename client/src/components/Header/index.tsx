import { FC } from 'react'
import { Typography, Avatar, Space, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { Flex } from '@/kit'
import { StyledHeaderWrapper } from './Header.styled.tsx'
import { useAppSelector } from '@/hooks'

const roles: Record<string, string> = {
	teacher: 'Учитель',
	admin: 'Администратор',
	student: 'Студент'
}

const getInitials = (name: string) =>
	name
		.split(' ')
		.map(n => n[0]?.toUpperCase())
		.join('')
		.slice(0, 2)

const Header: FC<{ onBurgerClick?: () => void }> = ({ onBurgerClick }) => {
	const user = useAppSelector(state => state.auth.user)

	if (!user.name || !user.role) return null

	return (
		<StyledHeaderWrapper>
			<Flex
				justifyContent='space-between'
				alignItems='center'
				direction='row'
			>
				<Button onClick={onBurgerClick} className='burger-menu-button'>
					<MenuOutlined className='burger-menu-icon' />
				</Button>
				<Space size='middle' align='center' className='right'>
					<Avatar style={{ backgroundColor: '#1890ff' }}>
						{getInitials(user.name)}
					</Avatar>
					<Typography.Text style={{ color: '#fff', fontSize: 16 }}>
						<strong>{user.name}</strong> — {roles[user.role]}
					</Typography.Text>
				</Space>
			</Flex>
		</StyledHeaderWrapper>
	)
}

export default Header
