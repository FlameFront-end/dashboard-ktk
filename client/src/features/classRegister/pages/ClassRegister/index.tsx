import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@/kit'
import ClassRegisterTable from '../../components/ClassRegisterTable'
import { PageWrapper } from '@/containers'

const ClassRegister: FC = () => {
	const { state } = useLocation()

	return (
		<PageWrapper>
			<Card title='Классный журнал'>
				<ClassRegisterTable groupId={state.id} />
			</Card>
		</PageWrapper>
	)
}

export default ClassRegister
