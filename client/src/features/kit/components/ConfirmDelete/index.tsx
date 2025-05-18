import type { FC, MouseEvent } from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface Props {
	title: string
	handleDelete: () => Promise<void>
	isLoading?: boolean
}

const ConfirmDelete: FC<Props> = ({
	title,
	handleDelete,
	isLoading = false
}) => {
	return (
		<Popconfirm
			title={title}
			onConfirm={() => {
				void handleDelete()
			}}
			okText='Да'
			cancelText='Нет'
			overlayStyle={{
				backgroundColor: '#1f1f1f',
				color: '#f0f0f0',
				borderColor: '#444444',
				borderRadius: 8,
				boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
			}}
			okButtonProps={{
				style: {
					backgroundColor: '#e55353',
					borderColor: '#e55353',
					color: '#fff',
					fontWeight: '600',
					transition: 'background-color 0.3s ease'
				},
				onMouseEnter: (e: MouseEvent<HTMLButtonElement>) => {
					e.currentTarget.style.backgroundColor = '#c03939'
				},
				onMouseLeave: (e: MouseEvent<HTMLButtonElement>) => {
					e.currentTarget.style.backgroundColor = '#e55353'
				}
			}}
			cancelButtonProps={{
				style: {
					backgroundColor: '#555555',
					borderColor: '#555555',
					color: '#eee',
					fontWeight: '500',
					transition: 'background-color 0.3s ease'
				},
				onMouseEnter: (e: MouseEvent<HTMLButtonElement>) => {
					e.currentTarget.style.backgroundColor = '#777777'
				},
				onMouseLeave: (e: MouseEvent<HTMLButtonElement>) => {
					e.currentTarget.style.backgroundColor = '#555555'
				}
			}}
		>
			<Button
				type='text'
				icon={<DeleteOutlined />}
				loading={isLoading}
				danger
				style={{
					color: '#e55353',
					fontWeight: '600',
					transition: 'background-color 0.3s ease',
					borderRadius: 6,
					padding: '4px 8px'
				}}
				onMouseEnter={e => {
					e.currentTarget.style.backgroundColor =
						'rgba(229, 83, 83, 0.1)'
				}}
				onMouseLeave={e => {
					e.currentTarget.style.backgroundColor = 'transparent'
				}}
			/>
		</Popconfirm>
	)
}

export default ConfirmDelete
