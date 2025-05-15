import { type FC, type ReactNode, useEffect, useState } from 'react'
import { Table, Input, Space, Button, message } from 'antd'
import {
	useDeleteTeacherByIdMutation,
	useGetAllTeachersQuery
} from '../../api/teachers.api.ts'
import { ConfirmDelete } from '@/kit'
import { StyledTeachersListWrapper } from './TeachersList.styled.tsx'
import TeacherModal from '../../components/TeacherModal'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/hooks'

interface DataSource {
	id: string
	name: string
	group: string
	email: string
	disciplines: string
}

const TeachersList: FC = () => {
	const role = useAppSelector(state => state.auth.user.role)
	const { data: teachers, isLoading, refetch } = useGetAllTeachersQuery()
	const [deleteTeacher] = useDeleteTeacherByIdMutation()

	const [searchText, setSearchText] = useState('')
	const [filteredData, setFilteredData] = useState<Collections.Teacher[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [editingTeacher, setEditingTeacher] =
		useState<Collections.Teacher | null>(null)

	useEffect(() => {
		void refetch()
	}, [])

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteTeacher(id).unwrap()
			void message.success('Преподаватель удалён')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении преподавателя')
		}
	}

	const handleModalClose = (): void => {
		setIsModalVisible(false)
		setEditingTeacher(null)
	}

	const handleModalSuccess = (): void => {
		setIsModalVisible(false)
		setIsModalVisible(false)
	}

	const handleSearch = (value: string): void => {
		setSearchText(value)
		const lowercasedValue = value.toLowerCase()

		const filtered = teachers?.filter(
			(teacher: Collections.Teacher) =>
				teacher.name.toLowerCase().includes(lowercasedValue) ||
				teacher.group?.name.toLowerCase().includes(lowercasedValue)
		)

		setFilteredData(filtered ?? [])
	}

	const handleEdit = (teacher: Collections.Teacher): void => {
		setEditingTeacher(teacher)
		setIsModalVisible(true)
	}

	function renderActions(record: DataSource): ReactNode {
		const teacher = teachers?.find(t => t.id === record.id)

		if (!teacher) {
			return null
		}

		return (
			<Space>
				<Button
					onClick={() => {
						handleEdit(teacher)
					}}
				>
					<EditOutlined />
				</Button>
				<ConfirmDelete
					handleDelete={async () => {
						await handleDelete(teacher.id)
					}}
					title='Вы уверены, что хотите удалить этого преподавателя?'
				/>
			</Space>
		)
	}

	const dataSource: DataSource[] =
		(searchText ? filteredData : teachers)?.map(record => ({
			id: record.id,
			name: record.name,
			group: record.group?.name ?? '-',
			email: record.email,
			disciplines: record.disciplines?.length
				? record.disciplines?.map(d => d.name).join(', ')
				: '-'
		})) ?? []

	const columns = [
		{
			title: 'ФИО',
			dataIndex: 'name'
		},
		{
			title: 'Группа',
			dataIndex: 'group'
		},
		{
			title: 'Дисциплина',
			dataIndex: 'disciplines'
		},
		...(role === 'teacher' || role === 'admin'
			? [
					{
						title: 'Email',
						dataIndex: 'email'
					}
				]
			: []),
		...(role === 'admin'
			? [
					{
						title: 'Действия',
						render: renderActions,
						width: 100
					}
				]
			: [])
	]

	return (
		<StyledTeachersListWrapper title='Преподаватели'>
			<Space
				direction='vertical'
				style={{ marginBottom: 16, width: '100%' }}
			>
				<div className='top-row'>
					<Input.Search
						placeholder='Введите имя или группу'
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
							Создать преподавателя
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
			<TeacherModal
				open={isModalVisible}
				onClose={handleModalClose}
				onSuccess={handleModalSuccess}
				teacher={editingTeacher}
			/>
		</StyledTeachersListWrapper>
	)
}

export default TeachersList
