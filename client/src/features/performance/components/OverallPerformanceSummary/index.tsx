import { FC } from 'react'
import { Typography, Divider } from 'antd'

interface Props {
	gradesData: {
		discipline: string
		grades: Collections.Grade[]
	}[]
}

const OverallPerformanceSummary: FC<Props> = ({ gradesData }) => {
	const allGrades = gradesData.flatMap(d => d.grades)
	const average =
		allGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
		allGrades.length
	const gradeDistribution = { 2: 0, 3: 0, 4: 0, 5: 0 }

	allGrades.forEach(g => {
		gradeDistribution[Number(g.grade) as 2 | 3 | 4 | 5]++
	})

	const best = gradesData.reduce(
		(best, current) => {
			const avg =
				current.grades.reduce((s, g) => s + Number(g.grade), 0) /
				current.grades.length
			return avg > best.avg ? { subject: current.discipline, avg } : best
		},
		{ subject: '', avg: 0 }
	)

	const worst = gradesData.reduce(
		(worst, current) => {
			const avg =
				current.grades.reduce((s, g) => s + Number(g.grade), 0) /
				current.grades.length
			return avg < worst.avg
				? { subject: current.discipline, avg }
				: worst
		},
		{ subject: '', avg: 5 }
	)

	return (
		<div style={{ marginBottom: 24 }}>
			<Divider orientation='center'>Общая статистика</Divider>
			<Typography.Paragraph>
				Всего оценок: <b>{allGrades.length}</b> | Средняя:{' '}
				<b>{average.toFixed(2)}</b>
			</Typography.Paragraph>
			<Typography.Paragraph>
				Лучшая дисциплина: <b>{best.subject}</b> ({best.avg.toFixed(2)}){' '}
				<br />
				Худшая дисциплина: <b>{worst.subject}</b> (
				{worst.avg.toFixed(2)})
			</Typography.Paragraph>
		</div>
	)
}

export default OverallPerformanceSummary
