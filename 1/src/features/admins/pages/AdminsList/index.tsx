import { type FC, type ReactNode, useEffect, useState } from 'react'
import { Table, Input, Space, Button, message } from 'antd'
import { ConfirmDelete } from '@/kit'
import { EditOutlined } from '@ant-design/icons'
import { StyledAdminsListWrapper } from './AdminsList.styled.tsx'
import {
	useDeleteAdminMutation,
	useGetAllAdminsQuery
} from '../../api/admins.api.ts'
import { useAppSelector } from '@/hooks'
import AdminModal from '../../components/AdminModal'

interface DataSource {
	id: string
	name: string
	email: string
}

const AdminsList: FC = () => {
	const role = useAppSelector(state => state.auth.user.role)

	const { data: admins, isLoading, refetch } = useGetAllAdminsQuery()
	const [deleteAadmin] = useDeleteAdminMutation()

	const [searchText, setSearchText] = useState('')
	const [filteredData, setFilteredData] = useState<Collections.Admin[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [editingAdmin, setEditingAdmin] = useState<Collections.Admin | null>(
		null
	)

	const handleRefetch = (): void => {
		void refetch()
	}

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteAadmin(id).unwrap()
			void message.success('Администратор удалён')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении администратора')
		}
	}

	const handleModal = (): void => {
		setIsModalVisible(false)
		setEditingAdmin(null)
	}

	const handleSearch = (value: string): void => {
		setSearchText(value)
		const lowercasedValue = value.toLowerCase()

		const filtered = admins?.filter(
			(admin: Collections.Admin) =>
				admin.name.toLowerCase().includes(lowercasedValue) ||
				admin.email.toLowerCase().includes(lowercasedValue)
		)

		setFilteredData(filtered ?? [])
	}

	const handleEdit = (admin: Collections.Admin): void => {
		setEditingAdmin(admin)
		setIsModalVisible(true)
	}

	const renderActions = (record: DataSource): ReactNode => {
		const admin = admins?.find(a => a.id === record.id)

		if (!admin) {
			return null
		}

		return (
			<Space>
				<Button
					onClick={() => {
						handleEdit(admin)
					}}
				>
					<EditOutlined />
				</Button>
				<ConfirmDelete
					handleDelete={async () => {
						await handleDelete(admin.id)
					}}
					title='Вы уверены, что хотите удалить этого администратора?'
				/>
			</Space>
		)
	}

	const dataSource: DataSource[] =
		(searchText ? filteredData : admins)?.map(record => ({
			id: record.id,
			name: record.name,
			email: record.email
		})) ?? []

	const columns = [
		{
			title: 'ФИО',
			dataIndex: 'name'
		},
		{
			title: 'Email',
			dataIndex: 'email'
		},
		...(role === 'admin'
			? [
					{
						title: 'Действия',
						render: renderActions
					}
				]
			: [])
	]

	useEffect(() => {
		void refetch()
	}, [])

	return (
		<StyledAdminsListWrapper title='Администаторы'>
			<Space
				direction='vertical'
				style={{ marginBottom: 16, width: '100%' }}
			>
				<div className='top-row'>
					<Input.Search
						placeholder='Введите имя или email'
						allowClear
						value={searchText}
						onChange={e => {
							handleSearch(e.target.value)
						}}
						onSearch={handleSearch}
					/>
					{role === 'admin' && (
						<Button
							onClick={() => {
								setIsModalVisible(true)
							}}
						>
							Создать администратора
						</Button>
					)}
				</div>
			</Space>
			<Table<DataSource>
				columns={columns}
				dataSource={dataSource}
				pagination={false}
				loading={isLoading}
				rowKey='id'
				scroll={{ x: 'max-content' }}
			/>
			<AdminModal
				open={isModalVisible}
				admin={editingAdmin}
				onClose={handleModal}
				onSuccess={handleModal}
				refetch={handleRefetch}
			/>
		</StyledAdminsListWrapper>
	)
}

export default AdminsList
