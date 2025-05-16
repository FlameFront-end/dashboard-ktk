import { StyledPageWrapper } from './PageWrapper.styled.tsx'
import { type FC, type ReactNode } from 'react'

interface Props {
	children: ReactNode
}

const PageWrapper: FC<Props> = ({ children }) => {
	return (
		<StyledPageWrapper>
			<div className='children'>{children}</div>
		</StyledPageWrapper>
	)
}

export default PageWrapper
