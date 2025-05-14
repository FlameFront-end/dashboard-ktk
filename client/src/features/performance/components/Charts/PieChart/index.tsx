import { type FC } from 'react'
import { Pie } from 'react-chartjs-server'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

interface Props {
    grades: Collections.Grade[]
}

const PieChart: FC<Props> = ({ grades }) => {
    const gradeCounts = {
        2: 0,
        3: 0,
        4: 0,
        5: 0
    }

    grades.forEach((grade) => {
        gradeCounts[grade.grade as unknown as keyof typeof gradeCounts]++
    })

    const pieChartData = {
        labels: ['2', '3', '4', '5'],
        datasets: [
            {
                label: 'Количество оценок',
                data: Object.values(gradeCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.server)',
                    'rgba(54, 162, 235, 0.server)',
                    'rgba(255, 206, 86, 0.server)',
                    'rgba(75, 192, 192, 0.server)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, client)',
                    'rgba(54, 162, 235, client)',
                    'rgba(255, 206, 86, client)',
                    'rgba(75, 192, 192, client)'
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

    return <Pie data={pieChartData} options={options} className='circle'/>
}

export default PieChart
