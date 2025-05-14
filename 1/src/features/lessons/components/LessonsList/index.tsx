import { type FC, useState } from 'react'
import { Button, Empty, Tabs, Typography } from 'antd'
import moment from 'moment/moment'
import { Flex } from '@/kit'
import { useGetGroupQuery } from '../../../groups/api/groups.api.ts'
import LessonsTable from '../LessonsTable'
import { useAppSelector } from '@/hooks'

interface Props {
	groupId: string
	tab?: string | undefined
}

const LessonsList: FC<Props> = ({ groupId, tab }) => {
	const role = useAppSelector(state => state.auth.user.role)
	const myId = useAppSelector(state => state.auth.user.id)

	const { data: group } = useGetGroupQuery(groupId)

	const schedule = group?.schedule ?? {
		id: '',
		friday: [],
		monday: [],
		tuesday: [],
		thursday: [],
		wednesday: []
	}

	const today = moment()
	const currentWeekStartInitial = today.startOf('isoWeek')
	const maxWeekStart = today.startOf('isoWeek')
	const [currentWeekStart, setCurrentWeekStart] = useState(
		currentWeekStartInitial
	)

	const lessonsByDiscipline = Object.values(schedule)
		.flat()
		.filter((entry): entry is Collections.Lesson =>
			Boolean(entry.discipline)
		)
		.reduce((acc: Record<string, Collections.Lesson[]>, lesson) => {
			const disciplineId = lesson.discipline?.id
			if (disciplineId) {
				acc[disciplineId] = acc[disciplineId] || []
				acc[disciplineId].push(lesson)
			}
			return acc
		}, {})

	const nextWeek = (): void => {
		const next = currentWeekStart.clone().add(1, 'week')
		if (!next.isAfter(maxWeekStart)) {
			setCurrentWeekStart(next)
		}
	}

	const previousWeek = (): void => {
		setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'))
	}

	const tabsItems = Object.entries(lessonsByDiscipline)
		.filter(([_, lessons]) => {
			if (role === 'teacher' && myId !== group?.teacher?.id) {
				return lessons[0]?.teacher?.id === myId
			}
			return true
		})
		.map(([disciplineId, lessons]) => ({
			key: disciplineId,
			label: lessons[0]?.discipline?.name ?? 'Unnamed Discipline',
			children: (
				<LessonsTable
					lessons={lessons}
					disciplineId={disciplineId}
					groupId={groupId}
					currentWeekStart={currentWeekStart}
					schedule={schedule}
					groupTeacherId={group?.teacher?.id}
				/>
			)
		}))

	return (
		<>
			{tabsItems.length ? (
				<>
					<div style={{ marginBottom: '16px' }}>
						<Flex gap={12} alignItems='center'>
							<Button
								onClick={previousWeek}
								disabled={currentWeekStart.isBefore(
									'2024-09-01'
								)}
							>
								Предыдущая неделя
							</Button>
							<Button
								onClick={nextWeek}
								disabled={currentWeekStart.isSame(maxWeekStart)}
							>
								Следующая неделя
							</Button>
							<span style={{ marginLeft: '16px' }}>
								{currentWeekStart.format('DD.MM.YYYY')} -{' '}
								{currentWeekStart
									.clone()
									.add(6, 'days')
									.format('DD.MM.YYYY')}
							</span>
						</Flex>
					</div>
					<Tabs
						defaultActiveKey={tab ?? tabsItems[0].key}
						items={tabsItems}
					/>
				</>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={<Typography.Text>Нет лекций</Typography.Text>}
				/>
			)}
		</>
	)
}

export default LessonsList
