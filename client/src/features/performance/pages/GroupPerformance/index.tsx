import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@/kit'

const GroupPerformance: FC = () => {
	const { state } = useLocation()

	console.log('state', state.id)

	return (
		<Card title='Успеваемость группы'>
			Графики успеваемости каждого студента группы {state.id}
		</Card>
	)
}

export default GroupPerformance
