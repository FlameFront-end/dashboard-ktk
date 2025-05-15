import { type FC } from 'react'
import { Bar } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js'
import { getDateFormat } from '@/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
	grades: Collections.Grade[]
}

export const BarChart: FC<Props> = ({ grades }) => {
	const sorted = [...grades].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	)

	const data = {
		labels: sorted.map(g => getDateFormat(g.date)),
		datasets: [
			{
				label: 'Оценка',
				data: sorted.map(g => Number(g.grade)),
				backgroundColor: 'rgba(153, 102, 255, 0.5)',
				borderColor: 'rgba(153, 102, 255, 1)',
				borderWidth: 1
			}
		]
	}

	const options = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				stepSize: 1
			}
		},
		plugins: {
			legend: { display: true },
			title: { display: false }
		}
	}

	return (
		<Bar
			data={data}
			options={options}
			style={{ maxHeight: 500, width: 'auto' }}
		/>
	)
}
