import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Empty, Tabs, Typography } from 'antd'
import GradesChart from '../../components/GradesChart'
import OverallPerformanceSummary from '../../components/OverallPerformanceSummary'
import { useGetAllGradesFromGroupQuery } from '../../api/performance.api.ts'
import { Card } from '@/kit'
import { PageWrapper } from '@/containers'

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
										items={student.disciplines.map(
											(discipline, disciplineIndex) => ({
												key: `${disciplineIndex}`,
												label: discipline.discipline,
												children: (
													<GradesChart
														key={disciplineIndex}
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
