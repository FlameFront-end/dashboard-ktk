import { type FC, type ReactNode, useState } from 'react'
import { useForm } from 'antd/lib/form/Form'
import { Button, Form, Input, message, Space, Table } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import {
	useCreateDisciplineMutation,
	useDeleteDisciplineMutation,
	useGetAllDisciplinesQuery
} from '../api/disciplines.api.ts'
import { Flex, ConfirmDelete, Card } from '@/kit'
import EditDisciplineModal from '../components/EditDisciplineModal'

interface DataSource {
	id: string
	name: string
}

const Disciplines: FC = () => {
	const [form] = useForm()
	const [deleteDiscipline] = useDeleteDisciplineMutation()
	const [createDiscipline, { isLoading: isCreating }] =
		useCreateDisciplineMutation()

	const { data: disciplines, refetch } = useGetAllDisciplinesQuery()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [editingDiscipline, setEditingDiscipline] =
		useState<Collections.Discipline | null>(null)

	const handleRefetch = (): void => {
		void refetch()
	}

	const onFinish = (values: any): void => {
		void createDiscipline(values)
			.then(() => {
				void message.success('Дисциплина успешно создана!')
				void refetch()
				form.setFieldsValue({ name: '' })
			})
			.catch(() => {
				void message.error('Ошибка при создании дисциплины')
			})
	}

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteDiscipline(id).unwrap()
			void message.success('Дисцпилина удалена')
			void refetch()
		} catch (error) {
			void message.error('Ошибка при удалении дисциплины')
		}
	}

	const handleEdit = (discipline: Collections.Discipline): void => {
		setEditingDiscipline(discipline)
		setIsModalVisible(true)
	}

	const handleModal = (): void => {
		setIsModalVisible(false)
		setEditingDiscipline(null)
	}

	const renderActions = (record: DataSource): ReactNode => {
		const discipline = disciplines?.find(item => item.id === record.id)

		if (!discipline) {
			return null
		}

		return (
			<Space>
				<Button
					onClick={() => {
						handleEdit(discipline)
					}}
				>
					<EditOutlined />
				</Button>
				<ConfirmDelete
					handleDelete={async () => {
						await handleDelete(discipline.id)
					}}
					title='Вы уверены, что хотите удалить эту дисциплину?'
				/>
			</Space>
		)
	}

	const columns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: 'Действия',
			render: renderActions,
			width: 150
		}
	]

	return (
		<Card title='Дисциплины'>
			<Form
				form={form}
				name='basic'
				onFinish={onFinish}
				layout='vertical'
			>
				<Flex alignItems='end' justifyContent='space-between' gap={24}>
					<Form.Item
						label='Название дисциплины'
						name='name'
						rules={[
							{
								required: true,
								message: 'Введите название дисциплины!'
							}
						]}
						style={{ width: '100%' }}
					>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={isCreating}
							disabled={isCreating}
						>
							Создать
						</Button>
					</Form.Item>
				</Flex>
			</Form>
			<Table
				columns={columns}
				dataSource={disciplines ?? []}
				pagination={false}
				scroll={{ x: 'max-content' }}
			/>

			<EditDisciplineModal
				open={isModalVisible}
				onClose={handleModal}
				onSuccess={handleModal}
				discipline={editingDiscipline}
				refetch={handleRefetch}
			/>
		</Card>
	)
}

export default Disciplines
