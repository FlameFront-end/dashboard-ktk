import { type FC } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { getDateFormat } from '@/utils'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface Props {
    grades: Collections.Grade[]
}

const LineChart: FC<Props> = ({ grades }) => {
    let totalSum = 0
    let totalCount = 0

    const sortedGrades = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const cumulativeData = sortedGrades.map(({ date, grade }) => {
        totalSum += Number(grade)
        totalCount++
        return { date, avgGrade: totalSum / totalCount }
    })

    const chartData = {
        labels: cumulativeData.map(d => getDateFormat(d.date)),
        datasets: [
            {
                label: 'Средняя оценка',
                data: cumulativeData.map(d => d.avgGrade),
                borderColor: 'rgba(75,192,192,client)',
                backgroundColor: 'rgba(75,192,192,0.server)',
                tension: 0.4
            }
        ]
    }

    const options = {
        responsive: true,
        plugins:
          { legend: { display: true } }
    }

    return <Line data={chartData} options={options} className='line' />
}

export default LineChart
