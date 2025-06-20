import { type FC } from 'react'
import { Typography, Divider } from 'antd'

interface Props {
	gradesData: Array<{
		discipline: string
		grades: Collections.Grade[]
	}>
}

const OverallPerformanceSummary: FC<Props> = ({ gradesData }) => {
	const allGradesFlat = gradesData.flatMap(d => d.grades)

	const allGrades = allGradesFlat.filter(
		d => d.grade !== 'n' && d.grade !== '-'
	)
	const missedCount = allGradesFlat.filter(d => d.grade === 'n').length

	const average =
		allGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
			allGrades.length || 0

	const gradeDistribution = { 2: 0, 3: 0, 4: 0, 5: 0 }

	allGrades.forEach(g => {
		const grade = Number(g.grade) as 2 | 3 | 4 | 5
		gradeDistribution[grade]++
	})

	const best = gradesData.reduce(
		(best, current) => {
			const validGrades = current.grades.filter(
				g => g.grade !== 'n' && g.grade !== '-'
			)
			const avg =
				validGrades.reduce((s, g) => s + Number(g.grade), 0) /
					validGrades.length || 0
			return avg > best.avg ? { subject: current.discipline, avg } : best
		},
		{ subject: '', avg: 0 }
	)

	const worst = gradesData.reduce(
		(worst, current) => {
			const validGrades = current.grades.filter(
				g => g.grade !== 'n' && g.grade !== '-'
			)
			const avg =
				validGrades.reduce((s, g) => s + Number(g.grade), 0) /
					validGrades.length || 5
			return avg < worst.avg
				? { subject: current.discipline, avg }
				: worst
		},
		{ subject: '', avg: 5 }
	)

	let diplomaType = ''
	let diplomaColor: 'success' | 'warning' | 'danger' = 'warning'

	if (average >= 4.9) {
		diplomaType = 'Красный диплом'
		diplomaColor = 'success'
	} else if (average < 2.5) {
		diplomaType = 'Под угрозой не допуска к защите'
		diplomaColor = 'danger'
	} else {
		diplomaType = 'Обычный (синий) диплом'
		diplomaColor = 'warning'
	}

	if (!allGrades.length) {
		return null
	}

	return (
		<div style={{ marginBottom: 24 }}>
			<Divider orientation='center'>Общая статистика</Divider>
			<Typography.Paragraph>
				Всего оценок: <b>{allGrades.length}</b> | Средняя оценка:{' '}
				<b>{average.toFixed(2)}</b> | Пропусков: <b>{missedCount}</b>
			</Typography.Paragraph>
			<Typography.Paragraph>
				Лучшая дисциплина: <b>{best.subject}</b> ({best.avg.toFixed(2)}){' '}
				<br />
				Худшая дисциплина: <b>{worst.subject}</b> (
				{worst.avg.toFixed(2)})
			</Typography.Paragraph>
			<Typography.Paragraph>
				Тип диплома:{' '}
				<Typography.Text type={diplomaColor}>
					<b>{diplomaType}</b>
				</Typography.Text>
			</Typography.Paragraph>
		</div>
	)
}

export default OverallPerformanceSummary
