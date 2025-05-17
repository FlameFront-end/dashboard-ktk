import { type FC, useMemo, useState } from 'react'
import { Table, Empty, Typography, Button, Space } from 'antd'
import moment from 'moment'
import { Flex } from '@/kit'
import { weekdays } from '@/constants'
import { type ColumnsType } from 'antd/es/table'

interface Grade {
	date: string
	grade: string
}

interface Props {
	data: {
		discipline: string
		grades: Grade[]
	}
}

interface RowType {
	key: string
	discipline: string
	[date: string]: string
}

const SingleStudentDisciplineGradesWithWeekSwitch: FC<Props> = ({ data }) => {
	const [currentWeekStart, setCurrentWeekStart] = useState(() =>
		moment().startOf('isoWeek')
	)

	const lessonDates = useMemo(
		() =>
			weekdays.map((_, index) =>
				currentWeekStart
					.clone()
					.day(index + 1)
					.format('YYYY-MM-DD')
			),
		[currentWeekStart]
	)

	const gradesMap = useMemo(() => {
		const map: Record<string, string> = {}
		for (const grade of data.grades) {
			if (lessonDates.includes(grade.date)) {
				map[grade.date] = grade.grade
			}
		}
		return map
	}, [data.grades, lessonDates])

	const columns: ColumnsType<RowType> = [
		{
			title: 'Дисциплина',
			dataIndex: 'discipline',
			key: 'discipline',
			fixed: 'left'
		},
		...lessonDates.map(date => ({
			title: moment(date).format('DD.MM'),
			dataIndex: date,
			key: date,
			align: 'center' as const
		}))
	]

	const gradesByDate = lessonDates.reduce<Record<string, string>>(
		(acc, date) => {
			acc[date] = gradesMap[date] ?? '-'
			return acc
		},
		{}
	)

	const rowData: { key: string; discipline: string; [key: string]: string } =
		{
			key: 'grades-row',
			discipline: data.discipline,
			...gradesByDate
		}

	const hasAnyGrade = Object.values(gradesMap).some(
		grade => grade !== undefined
	)

	const maxWeekStart = moment().startOf('isoWeek')

	const handlePrevWeek = (): void => {
		setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'))
	}

	const handleNextWeek = (): void => {
		const next = currentWeekStart.clone().add(1, 'week')
		if (!next.isAfter(maxWeekStart)) {
			setCurrentWeekStart(next)
		}
	}

	return (
		<Flex direction='column' gap={16}>
			<Space align='center'>
				<Button onClick={handlePrevWeek}>Предыдущая неделя</Button>
				<Button
					onClick={handleNextWeek}
					disabled={currentWeekStart.isSame(maxWeekStart)}
				>
					Следующая неделя
				</Button>
				<Typography.Text>
					{currentWeekStart.format('DD.MM.YYYY')} -{' '}
					{currentWeekStart
						.clone()
						.add(6, 'days')
						.format('DD.MM.YYYY')}
				</Typography.Text>
			</Space>

			{hasAnyGrade ? (
				<Table
					columns={columns}
					dataSource={[rowData]}
					pagination={false}
					scroll={{ x: 'max-content' }}
					bordered
				/>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={
						<Typography.Text>
							Нет оценок на этой неделе
						</Typography.Text>
					}
				/>
			)}
		</Flex>
	)
}

export default SingleStudentDisciplineGradesWithWeekSwitch
