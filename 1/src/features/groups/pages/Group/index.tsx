import { type FC, type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	Button,
	message,
	Space,
	Table,
	Tabs,
	type TabsProps,
	Typography
} from 'antd'
import { getDateFormat } from '@/utils'
import ScheduleTable from '../../../schedule/components/ScheduleTable'
import { Flex, Card, ConfirmDelete } from '@/kit'
import { pathsConfig } from '@/pathsConfig'
import { EditOutlined } from '@ant-design/icons'
import LessonsTable from '../../../lessons/components/LessonsList'
import {
	useDeleteGroupMutation,
	useGetGroupQuery
} from '../../api/groups.api.ts'
import { useAppSelector } from '@/hooks'
import { useDeleteStudentFromGroupMutation } from '../../../students/api/students.api.ts'
import ClassRegisterTable from '../../../classRegister/components/ClassRegisterTable'

interface DataSourceStudents {
	id: string
	name: string
	birthDate: string
	phone: string
	email: string
}

const Group: FC = () => {
	const navigate = useNavigate()
	const { state } = useLocation()

	const role = useAppSelector(state => state.auth.user.role)
	const myId = useAppSelector(state => state.auth.user.id)

	const groupId: string = state.id
	const tab: string | undefined = state.tab

	const [deleteGroup] = useDeleteGroupMutation()
	const [deleteStudentFromGroup] = useDeleteStudentFromGroupMutation()
	const { data: group, isLoading, refetch } = useGetGroupQuery(groupId)

	useEffect(() => {
		void refetch()
	}, [])

	const dataSourceStudents: DataSourceStudents[] =
		group?.students?.map(record => ({
			id: record?.id ?? '-',
			name: record?.name ?? '-',
			group: record?.group?.name ?? '-',
			birthDate: getDateFormat(record?.birthDate) ?? '-',
			phone: record?.phone ?? '-',
			email: record?.email ?? '-'
		})) ?? []

	const handleDeleteGroup = async (): Promise<void> => {
		try {
			await deleteGroup(groupId).unwrap()
			void message.success('Группа удалена')
			navigate(pathsConfig.group_list)
		} catch (error) {
			void message.error('Ошибка при удалении группы')
		}
	}

	const handleDeleteStudentFromGroup = async (id: string): Promise<void> => {
		try {
			await deleteStudentFromGroup(id).unwrap()
			void message.success('Студент исключён из группы')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении группы')
		}
	}

	const renderActions = (record: DataSourceStudents): ReactNode => {
		const student = group?.students?.find(item => item.id === record.id)

		if (!student) {
			return null
		}

		return (
			<Space>
				<ConfirmDelete
					handleDelete={async () => {
						await handleDeleteStudentFromGroup(student.id)
					}}
					title='Вы уверены, что хотите исключить этого студента из группы?'
				/>
			</Space>
		)
	}

	const columns = [
		{
			title: 'ФИО',
			dataIndex: 'name'
		},
		{
			title: 'Дата рождения',
			dataIndex: 'birthDate'
		},
		{
			title: 'Email',
			dataIndex: 'email'
		},
		{
			title: 'Телефон',
			dataIndex: 'phone'
		},
		...(role === 'teacher' || role === 'admin'
			? [
					{
						title: 'Действия',
						render: renderActions
					}
				]
			: [])
	]

	const tabs: TabsProps['items'] = [
		{
			key: '1',
			label: 'Расписание',
			children: (
				<>
					<Typography.Title
						level={5}
						style={{ marginBottom: '10px' }}
					>
						Расписание
					</Typography.Title>
					{!!group?.schedule && (
						<ScheduleTable schedule={group?.schedule} />
					)}
				</>
			)
		},
		{
			key: '2',
			label: 'Классный журнал',
			children: <ClassRegisterTable groupId={groupId} />
		},
		{
			key: '3',
			label: 'Лекции',
			children: <LessonsTable groupId={groupId} />
		},
		{
			key: '4',
			label: 'Студенты',
			children: (
				<>
					<Typography.Title
						level={5}
						style={{ marginBottom: '10px' }}
					>
						Студенты
					</Typography.Title>
					<div className='table-wrapper'>
						<Table<DataSourceStudents>
							columns={columns}
							dataSource={dataSourceStudents}
							pagination={false}
							loading={isLoading}
							rowKey='id'
						/>
					</div>
				</>
			)
		}
	]

	return (
		<Card title={`Группа: ${group?.name ?? '-'}`}>
			<Flex justifyContent='space-between'>
				<Typography.Title level={5} style={{ marginTop: '10px' }}>
					Классный руководитель: {group?.teacher?.name ?? '-'}
				</Typography.Title>

				<Flex alignItems='center'>
					{(role === 'admin' || myId === group?.teacher?.id) && (
						<Button
							onClick={() => {
								navigate(pathsConfig.edit_group, {
									state: { id: group?.id }
								})
							}}
						>
							<EditOutlined />
						</Button>
					)}

					{role === 'admin' && (
						<ConfirmDelete
							handleDelete={handleDeleteGroup}
							title='Вы уверены, что хотите удалить эту группу?'
						/>
					)}
				</Flex>
			</Flex>

			<Tabs defaultActiveKey={tab ?? '1'} items={tabs} />
		</Card>
	)
}

export default Group
