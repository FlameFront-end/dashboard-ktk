import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@/kit'
import { PageWrapper } from '@/containers'

const GroupPerformance: FC = () => {
	const { state } = useLocation()

	return (
		<PageWrapper>
			<Card title='Успеваемость группы'>
				Графики успеваемости каждого студента группы {state.id}
			</Card>
		</PageWrapper>
	)
}

export default GroupPerformance
