import { Typography, Avatar, Space } from 'antd'
import { type FC } from 'react'
import { Flex } from '@/kit'
import { StyledHeaderWrapper } from './Header.styled.tsx'
import { useAppSelector } from '@/hooks'

const roles: Record<string, string> = {
	teacher: 'Учитель',
	admin: 'Администратор',
	student: 'Студент'
}

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map(n => n[0]?.toUpperCase())
		.join('')
		.slice(0, 2)
}

const Header: FC = () => {
	const user = useAppSelector(state => state.auth.user)

	if (!user.name || !user.role) return null

	return (
		<StyledHeaderWrapper
			style={{ padding: '8px 24px', backgroundColor: '#141414' }}
		>
			<Flex justifyContent='flex-end' alignItems='center'>
				<Space size='middle' align='center'>
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
