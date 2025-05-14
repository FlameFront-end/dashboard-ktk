import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Empty, Tabs, Typography } from 'antd'
import GradesChart from '../../components/GradesChart'
import { useGetAllGradesFromStudentQuery } from '../../api/performance.api.ts'
import { Card } from '@/kit'

const IndividualPerformance: FC = () => {
	const { state } = useLocation()
	const { data: gradesData } = useGetAllGradesFromStudentQuery(state.id)

	return (
		<Card title='Моя успеваемость'>
			{gradesData?.length ? (
				<Tabs
					items={gradesData.map((item, index) => ({
						key: `${index}`,
						label: item.discipline,
						children: <GradesChart key={index} data={item} />
					}))}
				/>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={<Typography.Text>Нет оценок</Typography.Text>}
				/>
			)}
		</Card>
	)
}

export default IndividualPerformance
