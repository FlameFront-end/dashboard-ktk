import { isValidElement, type ReactElement, type FC } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import {
	SidebarContainer,
	MenuItemContainer,
	MenuItemLabel,
	LogoutButton,
	LogoutButtonLabel,
	Separator,
	MobileSidebarOverlay,
	MobileSidebarContent,
	CloseButton,
	MenuItemsWrapper
} from './Sidebar.styled'
import { useAppSelector } from '@/hooks'
import { useGetChatByGroupIdQuery } from '../../features/chat/api/chat.api'
import { useGetTeacherByIdQuery } from '../../features/teachers/api/teachers.api'

interface MenuItem {
	label: string
	key: string
	path: string
	onClick: () => void
	state?: {
		id?: string
	}
}

type MenuItemsWithSeparators = Array<MenuItem[] | MenuItem | ReactElement>

interface Props {
	closeMobileSidebar: () => void
	mobileSidebarOpen: boolean
}

const Sidebar: FC<Props> = ({ closeMobileSidebar, mobileSidebarOpen }) => {
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
						},
						state: { id: groupId }
					},
					{
						label: 'Классный журнал',
						key: 'class_register',
						path: pathsConfig.class_register,
						onClick: () => {
							navigate(pathsConfig.class_register, {
								state: { id: groupId }
							})
						},
						state: { id: groupId }
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
												state: { id: userId ?? '' }
											}
										)
									},
									state: { id: userId ?? '' }
								}
							]
						: []),
					...(role === 'teacher'
						? [
								{
									label: 'Успеваемость группы',
									key: 'group_performance',
									path: pathsConfig.group_performance,
									onClick: () => {
										navigate(
											pathsConfig.group_performance,
											{
												state: { id: groupId }
											}
										)
									},
									state: { id: groupId }
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
						},
						state: { id: groupId }
					}
				]
			: []),
		...(chat?.id
			? [
					{
						label: 'Чат группы',
						key: `chat-${chat.id}`,
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
			? teacher.teachingGroups
					.filter(g => g.id !== teacher.group?.id)
					.flatMap(group => [
						<Separator key={`separator-teacher-${group.id}`} />,
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
							key: `lessons-${group.id}`,
							path: pathsConfig.lessons,
							onClick: () => {
								navigate(pathsConfig.lessons, {
									state: { id: group.id }
								})
							},
							state: { id: group.id }
						}
					])
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

	const isMenuItem = (obj: any): obj is MenuItem => {
		return (
			obj &&
			typeof obj === 'object' &&
			'key' in obj &&
			'path' in obj &&
			'onClick' in obj &&
			'label' in obj
		)
	}

	const content = (
		<>
			<MenuItemsWrapper>
				{menuItems.map(item => {
					if (isValidElement(item)) return item

					const itemsArray = Array.isArray(item) ? item : [item]

					return itemsArray.map(menuItem => {
						if (isValidElement(menuItem)) return menuItem

						if (isMenuItem(menuItem)) {
							const isActive =
								location.pathname === menuItem.path &&
								(menuItem.state?.id
									? location.state?.id === menuItem.state.id
									: true)

							return (
								<MenuItemContainer
									key={menuItem.key}
									onClick={() => {
										menuItem.onClick()
										closeMobileSidebar()
									}}
									className={isActive ? 'active' : ''}
								>
									<MenuItemLabel>
										{menuItem.label}
									</MenuItemLabel>
								</MenuItemContainer>
							)
						}

						return null
					})
				})}
			</MenuItemsWrapper>
			<LogoutButton
				onClick={() => {
					logout()
					closeMobileSidebar()
				}}
			>
				<LogoutButtonLabel>Выход</LogoutButtonLabel>
			</LogoutButton>
		</>
	)

	if (mobileSidebarOpen) {
		return (
			<MobileSidebarOverlay
				$visible={mobileSidebarOpen}
				onClick={closeMobileSidebar}
			>
				<MobileSidebarContent
					onClick={e => {
						e.stopPropagation()
					}}
				>
					<CloseButton onClick={closeMobileSidebar}>×</CloseButton>
					{content}
				</MobileSidebarContent>
			</MobileSidebarOverlay>
		)
	}

	return <SidebarContainer>{content}</SidebarContainer>
}

export default Sidebar
