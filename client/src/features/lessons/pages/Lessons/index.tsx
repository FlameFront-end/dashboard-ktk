import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import LessonsList from '../../components/LessonsList'
import { Card } from '@/kit'
import { PageWrapper } from '@/containers'

const Lessons: FC = () => {
	const { state } = useLocation()

	return (
		<PageWrapper>
			<Card title='Лекции'>
				<LessonsList groupId={state.id} tab={state.tab} />
			</Card>
		</PageWrapper>
	)
}

export default Lessons
