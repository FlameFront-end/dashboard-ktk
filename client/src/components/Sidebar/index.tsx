import { type FC, isValidElement, type ReactElement } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.ts'
import { useNavigate, useLocation } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import {
	SidebarContainer,
	MenuItemContainer,
	MenuItemLabel,
	LogoutButton,
	LogoutButtonLabel,
	Separator
} from './Sidebar.styled'
import { useAppSelector } from '@/hooks'
import { useGetChatByGroupIdQuery } from '../../features/chat/api/chat.api.ts'
import { useGetTeacherByIdQuery } from '../../features/teachers/api/teachers.api.ts'

interface MenuItem {
	label: string
	key: string
	path: string
	onClick: () => void
	state?: { id: string }
}

type MenuItemsWithSeparators = Array<MenuItem[] | MenuItem | ReactElement>

const Sidebar: FC = () => {
	const role = useAppSelector(state => state.auth.user.role)
	const groupId = useAppSelector(state => state.auth.user.groupId)
	const userId = useAppSelector(state => state.auth.user.id)
	const { logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const { data: chat } = useGetChatByGroupIdQuery(groupId ?? '', {
		skip: !groupId
	})
	const { data: teacher } = useGetTeacherByIdQuery(userId ?? '', {
		skip: role !== 'teacher'
	})

	const menuItems: MenuItemsWithSeparators = [
		...(role === 'teacher' || role === 'admin'
			? [
					{
						label: 'Все группы',
						key: 'group_list',
						path: pathsConfig.group_list,
						onClick: () => {
							navigate(pathsConfig.group_list)
						}
					}
				]
			: []),
		{
			label: 'Преподаватели',
			key: 'teachers_list',
			path: pathsConfig.teachers_list,
			onClick: () => {
				navigate(pathsConfig.teachers_list)
			}
		},
		{
			label: 'Студенты',
			key: 'students_list',
			path: pathsConfig.students_list,
			onClick: () => {
				navigate(pathsConfig.students_list)
			}
		},
		...(role === 'teacher' || role === 'admin'
			? [
					{
						label: 'Администраторы',
						key: 'admins_list',
						path: pathsConfig.admins_list,
						onClick: () => {
							navigate(pathsConfig.admins_list)
						}
					}
				]
			: []),
		...(role === 'admin'
			? [
					{
						label: 'Дисциплины',
						key: 'disciplines',
						path: pathsConfig.disciplines,
						onClick: () => {
							navigate(pathsConfig.disciplines)
						}
					}
				]
			: []),
		...(groupId
			? [
					<Separator key='separator-group' />,
					{
						label: 'Моя группа',
						key: 'my_group',
						path: pathsConfig.group,
						onClick: () => {
							navigate(pathsConfig.group, {
								state: { id: groupId }
							})
						}
					},
					{
						label: 'Классный журнал',
						key: 'class_register',
						path: pathsConfig.class_register,
						onClick: () => {
							navigate(pathsConfig.class_register, {
								state: { id: groupId }
							})
						}
					},
					...(role === 'student'
						? [
								{
									label: 'Моя успеваемость',
									key: 'my_individual_performance',
									path: pathsConfig.individual_performance,
									onClick: () => {
										navigate(
											pathsConfig.individual_performance,
											{
												state: { id: userId }
											}
										)
									}
								}
							]
						: []),
					{
						label: 'Лекции',
						key: 'my_lessons',
						path: pathsConfig.lessons,
						onClick: () => {
							navigate(pathsConfig.lessons, {
								state: { id: groupId }
							})
						}
					}
				]
			: []),
		...(chat?.id
			? [
					{
						label: 'Чат группы',
						key: 'chat',
						path: pathsConfig.chat,
						onClick: () => {
							navigate(pathsConfig.chat, {
								state: { id: chat.id }
							})
						},
						state: { id: chat.id }
					}
				]
			: []),
		...(role === 'teacher' && teacher?.teachingGroups
			? teacher.teachingGroups.filter(
					group => group.id !== teacher.group?.id
				).length > 0
				? [
						...teacher.teachingGroups
							.filter(group => group.id !== teacher.group?.id)
							.flatMap(group => [
								<Separator
									key={`separator-teacher-${group.id}`}
								/>,
								{
									label: `Чат группы ${group.name}`,
									key: `chat-${group.chat.id}`,
									path: pathsConfig.chat,
									onClick: () => {
										navigate(pathsConfig.chat, {
											state: { id: group.chat.id }
										})
									},
									state: { id: group.chat.id }
								},
								{
									label: `Лекции ${group.name}`,
									key: `lessons-${group.chat.id}`,
									path: pathsConfig.lessons,
									onClick: () => {
										navigate(pathsConfig.lessons, {
											state: { id: group.id }
										})
									},
									state: { id: group.id }
								}
							])
					]
				: []
			: []),
		<Separator key='separator-support' />,
		{
			label: 'Поддержка',
			key: 'support',
			path: pathsConfig.support,
			onClick: () => {
				navigate(pathsConfig.support)
			}
		}
	]

	return (
		<SidebarContainer>
			{menuItems.map(item => {
				if (isValidElement(item)) {
					return item
				}
				const itemMenuItem = item as MenuItem | MenuItem[]

				if (Array.isArray(itemMenuItem)) {
					return itemMenuItem.map(item => {
						const isActive = !item.key.includes('chat')
							? location.pathname === item.path
							: location.state?.id === item?.state?.id

						return (
							<MenuItemContainer
								key={item.key}
								onClick={item.onClick}
								className={isActive ? 'active' : ''}
							>
								<MenuItemLabel>{item.label}</MenuItemLabel>
							</MenuItemContainer>
						)
					})
				} else {
					const isActive =
						!itemMenuItem.key.includes('chat') &&
						!itemMenuItem.key.includes('lessons')
							? location.pathname === itemMenuItem.path
							: location.state?.id === itemMenuItem?.state?.id

					return (
						<MenuItemContainer
							key={itemMenuItem.key}
							onClick={itemMenuItem.onClick}
							className={isActive ? 'active' : ''}
						>
							<MenuItemLabel>{itemMenuItem.label}</MenuItemLabel>
						</MenuItemContainer>
					)
				}
			})}
			<LogoutButton onClick={logout}>
				<LogoutButtonLabel>Выход</LogoutButtonLabel>
			</LogoutButton>
		</SidebarContainer>
	)
}

export default Sidebar
