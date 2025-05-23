import { type FC, type ReactNode, useEffect, useState } from 'react'
import { Table, Input, Space, Button, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { StyledStudentsListWrapper } from './StudentsList.styled'
import {
	useDeleteStudentMutation,
	useGetAllStudentsQuery
} from '../../api/students.api.ts'
import { ConfirmDelete } from '@/kit'
import { getDateFormat } from '@/utils'
import { useAppSelector } from '@/hooks'
import StudentModal from '../../components/StudentModal'
import type { ColumnsType } from 'antd/es/table'
import { PageWrapper } from '@/containers'

interface DataSource {
	id: string
	name: string
	group: string
	birthDate: string
	phone: string
	email: string
}

const StudentsList: FC = () => {
	const role = useAppSelector(state => state.auth.user.role)

	const { data: students, isLoading, refetch } = useGetAllStudentsQuery()
	const [deleteStudent] = useDeleteStudentMutation()

	const [searchText, setSearchText] = useState('')
	const [filteredData, setFilteredData] = useState<Collections.Student[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [editingStudent, setEditingStudent] =
		useState<Collections.Student | null>(null)

	useEffect(() => {
		void refetch()
	}, [])

	const handleModalClose = (): void => {
		setIsModalVisible(false)
		setEditingStudent(null)
	}

	const handleModalSuccess = (): void => {
		setIsModalVisible(false)
		setEditingStudent(null)
	}

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteStudent(id).unwrap()
			void message.success('Студент удалён')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении студента')
		}
	}

	const handleSearch = (value: string): void => {
		setSearchText(value)
		const lowercasedValue = value.toLowerCase()

		const filtered = students?.filter(
			(student: Collections.Student) =>
				student.name.toLowerCase().includes(lowercasedValue) ||
				student.group?.name.toLowerCase().includes(lowercasedValue)
		)

		setFilteredData(filtered ?? [])
	}

	const handleEdit = (student: Collections.Student): void => {
		setEditingStudent(student)
		setIsModalVisible(true)
	}

	const renderActions = (_: any, record: DataSource): ReactNode => {
		const student = students?.find(item => item.id === record.id)

		if (!student) {
			return null
		}

		return (
			<Space>
				<Button
					onClick={() => {
						handleEdit(student)
					}}
					icon={<EditOutlined />}
				/>
				<ConfirmDelete
					handleDelete={async () => {
						await handleDelete(student.id)
					}}
					title='Вы уверены, что хотите удалить этого студента?'
				/>
			</Space>
		)
	}

	const dataSource: DataSource[] =
		(searchText ? filteredData : students)?.map(record => ({
			id: record?.id ?? '-',
			name: record?.name ?? '-',
			group: record?.group?.name ?? '-',
			birthDate: getDateFormat(record?.birthDate) ?? '-',
			phone: record?.phone ?? '-',
			email: record?.email ?? '-'
		})) ?? []

	const columns: ColumnsType<DataSource> = [
		{
			title: 'ФИО',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: 'Группа',
			dataIndex: 'group',
			key: 'group'
		},
		{
			title: 'Дата рождения',
			dataIndex: 'birthDate',
			key: 'birthDate'
		},
		...(role === 'teacher' || role === 'admin'
			? [
					{
						title: 'Email',
						dataIndex: 'email',
						key: 'email'
					},
					{
						title: 'Телефон',
						dataIndex: 'phone',
						key: 'phone'
					}
				]
			: []),
		...(role === 'admin'
			? [
					{
						title: 'Действия',
						key: 'actions',
						render: renderActions,
						width: 100
					}
				]
			: [])
	]

	return (
		<PageWrapper>
			<StyledStudentsListWrapper title='Студенты'>
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
								Создать студента
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
				<StudentModal
					open={isModalVisible}
					onClose={handleModalClose}
					onSuccess={handleModalSuccess}
					student={editingStudent}
				/>
			</StyledStudentsListWrapper>
		</PageWrapper>
	)
}

export default StudentsList
