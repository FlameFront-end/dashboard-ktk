import { type FC, type SetStateAction, useEffect, useState } from 'react'
import { Button, Collapse, message, Typography } from 'antd'
import ScheduleTable from '../../../schedule/components/ScheduleTable'
import { Link, useNavigate } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import { StyledGroupListWrapper } from './GroupList.styled.tsx'
import {
	useDeleteGroupMutation,
	useGetAllGroupsQuery
} from '../../api/groups.api.ts'
import { Flex, ConfirmDelete } from '@/kit'
import { useAppSelector } from '@/hooks'
import { PageWrapper } from '@/containers'

const LOCAL_STORAGE_KEY = 'GROUP_LIST_OPEN_KEYS'

const GroupList: FC = () => {
	const navigate = useNavigate()
	const role = useAppSelector(state => state.auth.user.role)

	const { data: groups, refetch } = useGetAllGroupsQuery(true)
	const [deleteGroup] = useDeleteGroupMutation()

	const [activeKeys, setActiveKeys] = useState<string[]>([])

	useEffect(() => {
		void refetch()
	}, [])

	useEffect(() => {
		if (groups?.length) {
			const savedKeys = localStorage.getItem(LOCAL_STORAGE_KEY)

			let validKeys: SetStateAction<string[]> = []

			if (savedKeys) {
				const parsed = JSON.parse(savedKeys) as string[]
				validKeys = parsed.filter(id => groups.some(g => g.id === id))
			}

			if (validKeys.length) {
				setActiveKeys(validKeys)
			} else {
				setActiveKeys([groups[0].id])
			}
		}
	}, [groups])

	useEffect(() => {
		if (groups?.length) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeKeys))
		}
	}, [activeKeys])

	const groupByCourse = (
		groups: Collections.Group[]
	): Collections.GroupedCourses => {
		const courseMap: Record<string, Collections.Group[]> = {}

		groups.forEach(group => {
			const course = group.name[0]
			if (!courseMap[course]) {
				courseMap[course] = []
			}
			courseMap[course].push(group)
		})

		return Object.entries(courseMap).sort(
			([courseA], [courseB]) => Number(courseA) - Number(courseB)
		)
	}

	const groupedCourses: Collections.GroupedCourses = groupByCourse(
		groups ?? []
	)

	const handleCollapseChange = (keys: string | string[]): void => {
		setActiveKeys(Array.isArray(keys) ? keys : [keys])
	}

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteGroup(id).unwrap()
			void message.success('Группа удалена')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении группы')
		}
	}

	return (
		<PageWrapper>
			<StyledGroupListWrapper
				title='Группы'
				headerRight={
					<>
						{role === 'admin' && (
							<Button
								onClick={() => {
									navigate(pathsConfig.create_group)
								}}
							>
								Создать группу
							</Button>
						)}
					</>
				}
			>
				<div className='group-list'>
					{groupedCourses.map(([course, courseGroups]) => (
						<div key={course}>
							<Typography.Title level={3}>
								{course} курс
							</Typography.Title>
							<Collapse
								className='styled-collapse'
								activeKey={activeKeys}
								onChange={handleCollapseChange}
								items={courseGroups.map(group => ({
									key: group.id,
									label: group.name,
									children: (
										<>
											<div className='collapse-top'>
												<div className='left'>
													<div>
														Классный руководитель:{' '}
														{group.teacher?.name ??
															'-'}
													</div>
													{group.schedule && (
														<div>Расписание</div>
													)}
												</div>
												<Flex alignItems='center'>
													<Link
														to={pathsConfig.group}
														state={{ id: group.id }}
													>
														Страница группы
													</Link>
													{role === 'admin' && (
														<ConfirmDelete
															handleDelete={async () => {
																await handleDelete(
																	group.id
																)
															}}
															title='Вы уверены, что хотите удалить эту группу?'
														/>
													)}
												</Flex>
											</div>

											{group.schedule && (
												<ScheduleTable
													schedule={group.schedule}
												/>
											)}
										</>
									)
								}))}
							/>
						</div>
					))}
				</div>
			</StyledGroupListWrapper>
		</PageWrapper>
	)
}

export default GroupList
