import { type FC } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
	grades: Collections.Grade[]
}

export const PieChart: FC<Props> = ({ grades }) => {
	const gradeCounts = {
		2: 0,
		3: 0,
		4: 0,
		5: 0
	}

	grades.forEach(grade => {
		const value = grade.grade as unknown as keyof typeof gradeCounts
		if (gradeCounts[value] !== undefined) {
			gradeCounts[value]++
		}
	})

	const pieChartData = {
		labels: ['2', '3', '4', '5'],
		datasets: [
			{
				label: 'Количество оценок',
				data: Object.values(gradeCounts),
				backgroundColor: [
					'rgba(255, 99, 132, 0.6)',
					'rgba(54, 162, 235, 0.6)',
					'rgba(255, 206, 86, 0.6)',
					'rgba(75, 192, 192, 0.6)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)'
				],
				borderWidth: 1
			}
		]
	}

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const
			},
			title: {
				display: true,
				text: 'Распределение оценок'
			}
		}
	}

	return (
		<Pie
			data={pieChartData}
			options={options}
			className='circle'
			style={{ maxHeight: 500, width: 'auto' }}
		/>
	)
}
