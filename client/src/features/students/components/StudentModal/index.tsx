import { type FC, useEffect } from 'react'
import { Button, DatePicker, Input, Modal, Form, message, Select } from 'antd'
import {
	useCreateStudentMutation,
	useGetAllStudentsQuery,
	useUpdateStudentMutation
} from '../../api/students.api.ts'
import dayjs from 'dayjs'
import { useGetAllGroupsQuery } from '../../../groups/api/groups.api.ts'

interface Props {
	open: boolean
	onClose: () => void
	onSuccess: () => void
	student: Collections.Student | null
}

interface CreateValues {
	birthDate: string
	email: string
	group: string
	name: string
	phone?: string | undefined
}

const StudentModal: FC<Props> = ({ open, onClose, onSuccess, student }) => {
	const [form] = Form.useForm()
	const { data: groups, refetch: refetchGroups } = useGetAllGroupsQuery(false)

	const [createStudent, { isLoading: isLoadingCreate }] =
		useCreateStudentMutation()
	const [updateStudent, { isLoading: isLoadingUpdate }] =
		useUpdateStudentMutation()

	const { refetch } = useGetAllStudentsQuery()

	useEffect(() => {
		if (student) {
			const formattedData = {
				...student,
				group: student.group?.id,
				birthDate: student.birthDate
					? dayjs(student.birthDate, 'DD.MM.YYYY')
					: null
			}

			form.setFieldsValue(formattedData)
		} else {
			form.resetFields()
		}
	}, [student])

	const handleSubmit = async (values: CreateValues): Promise<void> => {
		try {
			const formattedValues = { ...values }
			if (values.birthDate) {
				formattedValues.birthDate = dayjs(values.birthDate).format(
					'DD.MM.YYYY'
				)
			}

			if (student) {
				await updateStudent({
					id: student.id,
					name: formattedValues.name,
					groupId: formattedValues.group,
					birthDate: formattedValues.birthDate,
					phone: formattedValues.phone,
					email: formattedValues.email
				}).unwrap()
				void message.success('Студент успешно изменён')
			} else {
				await createStudent({
					name: formattedValues.name,
					groupId: formattedValues.group,
					birthDate: formattedValues.birthDate,
					phone: formattedValues.phone,
					email: formattedValues.email
				}).unwrap()
				void message.success(
					'Данные для входа отправлены студенту на почту'
				)
			}

			void refetch()
			form.resetFields()
			onSuccess()
			onClose()
		} catch (error: any) {
			if (student) {
				void message.error('Ошибка при редактировании студента')
			} else {
				if (
					error.data.message === 'User with this email already exists'
				) {
					void message.error('Эта почта уже занята')
				} else {
					void message.error('Ошибка при создании преподавателя')
				}
			}
		}
	}

	useEffect(() => {
		void refetchGroups()
	}, [])

	return (
		<Modal
			title={student ? 'Изменить студента' : 'Создать студента'}
			open={open}
			onCancel={onClose}
			footer={null}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={values => {
					void handleSubmit(values)
				}}
			>
				<Form.Item
					name='name'
					label='ФИО'
					rules={[{ required: true, message: 'Введите ФИО' }]}
				>
					<Input placeholder='Введите ФИО' />
				</Form.Item>
				<Form.Item
					name='email'
					label='Email'
					rules={[{ required: true, message: 'Введите email' }]}
				>
					<Input type='email' placeholder='Введите email' />
				</Form.Item>
				<Form.Item
					name='group'
					label='Группа'
					rules={[{ required: true, message: 'Выберите группу' }]}
				>
					<Select
						placeholder='Выберите группу'
						showSearch
						filterOption={(input, option) =>
							(option?.label ?? '')
								.toLowerCase()
								.includes(input.toLowerCase())
						}
						options={groups?.map(group => ({
							value: group.id,
							label: group.name
						}))}
					/>
				</Form.Item>
				<Form.Item
					name='birthDate'
					label='Дата рождения'
					rules={[
						{ required: true, message: 'Выберите дату рождения' }
					]}
				>
					<DatePicker
						format='DD.MM.YYYY'
						style={{ width: '100%' }}
						placeholder='Выберите дату'
					/>
				</Form.Item>
				<Form.Item name='phone' label='Номер телефона'>
					<Input type='phone' placeholder='Введите номер телефона' />
				</Form.Item>
				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						loading={isLoadingCreate || isLoadingUpdate}
					>
						{student ? 'Изменить' : 'Создать'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default StudentModal
