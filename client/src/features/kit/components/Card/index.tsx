import { type FC, type ReactNode } from 'react'
import { Typography } from 'antd'
import { CardWrapper } from './Card.styled.tsx'

interface Props {
	title?: string
	children: ReactNode
	className?: string
	header?: ReactNode
	headerRight?: ReactNode
}

const Card: FC<Props> = ({
	children,
	className,
	title,
	header,
	headerRight
}) => {
	return (
		<CardWrapper className={className}>
			{header && header}

			{headerRight && title && (
				<div className='top_row'>
					<Typography.Title level={2} style={{ marginBottom: 0 }}>
						{title}
					</Typography.Title>
					<div>{headerRight}</div>
				</div>
			)}

			{title && !headerRight && (
				<Typography.Title level={2} style={{ marginBottom: '20px' }}>
					{title}
				</Typography.Title>
			)}

			{children}
		</CardWrapper>
	)
}

export default Card
