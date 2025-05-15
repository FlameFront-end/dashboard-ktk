import { FC } from 'react'
import { Typography, Divider } from 'antd'
import { LineChart, BarChart, PieChart } from '../Charts'

interface Props {
	data: {
		discipline: string
		grades: Collections.Grade[]
	}
}

const GradesChart: FC<Props> = ({ data }) => {
	const grades = data.grades
	const average =
		grades.reduce((sum, g) => sum + Number(g.grade), 0) / grades.length
	const lastGrade = grades[grades.length - 1]?.grade

	return (
		<>
			<Typography.Paragraph>
				Средняя оценка: <b>{average.toFixed(2)}</b> | Последняя оценка:{' '}
				<b>{lastGrade}</b>
			</Typography.Paragraph>

			<Divider orientation='center'>График прогресса</Divider>
			<LineChart grades={grades} />

			<Divider orientation='center'>Распределение</Divider>
			<PieChart grades={grades} />

			<Divider orientation='center'>Оценки по датам</Divider>
			<BarChart grades={grades} />
		</>
	)
}

export default GradesChart
