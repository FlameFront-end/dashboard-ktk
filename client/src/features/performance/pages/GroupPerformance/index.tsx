import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Empty, Tabs, Typography } from 'antd'
import { Card } from '@/kit'
import { PageWrapper } from '@/containers'
import { useGetAllGradesFromGroupQuery } from '../../api/performance.api.ts'
import GradesChart from '../../components/GradesChart'
import OverallPerformanceSummary from '../../components/OverallPerformanceSummary'

const GroupPerformance: FC = () => {
	const { state } = useLocation()
	const { data: gradesData } = useGetAllGradesFromGroupQuery(state.id)

	return (
		<PageWrapper>
			<Card title='Успеваемость группы'>
				{gradesData?.length ? (
					<Tabs
						items={gradesData.map(student => ({
							key: student.studentId,
							label: student.studentName,
							children: (
								<>
									<OverallPerformanceSummary
										gradesData={student.disciplines}
									/>
									<Tabs
										type='card'
										items={student.disciplines.map(
											(discipline, dIndex) => ({
												key: `${dIndex}`,
												label: discipline.discipline,
												children: (
													<GradesChart
														key={dIndex}
														data={discipline}
													/>
												)
											})
										)}
									/>
								</>
							)
						}))}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={
							<Typography.Text>
								Нет данных об успеваемости
							</Typography.Text>
						}
					/>
				)}
			</Card>
		</PageWrapper>
	)
}

export default GroupPerformance
