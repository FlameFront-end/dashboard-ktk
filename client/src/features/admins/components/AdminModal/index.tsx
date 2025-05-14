import { type FC, useEffect } from 'react'
import { Button, Input, Modal, Form, message } from 'antd'

import {
	useCreateAdminMutation,
	useUpdateAdminMutation
} from '../../api/admins.api.ts'

interface Props {
	open: boolean
	onClose: () => void
	onSuccess: () => void
	admin: Collections.Admin | null
	refetch: () => void
}

const AdminModal: FC<Props> = ({
	open,
	onClose,
	onSuccess,
	admin,
	refetch
}) => {
	const [form] = Form.useForm()

	const [createAdmin, { isLoading: isLoadingCreate }] =
		useCreateAdminMutation()
	const [updateAdmin, { isLoading: isLoadingUpdate }] =
		useUpdateAdminMutation()

	const handleSubmit = async (values: any): Promise<void> => {
		try {
			if (admin) {
				await updateAdmin({ id: admin.id, ...values }).unwrap()
				void message.success('Администратору успешно изменён')
			} else {
				await createAdmin(values).unwrap()
				void message.success(
					'Данные для входа отправлены администратору на почту'
				)
			}
			onSuccess()
			onClose()
			refetch()
			form.resetFields()
		} catch (error: any) {
			if (admin) {
				void message.error('Ошибка при редактировании администратора')
			} else {
				if (
					error.data.message === 'User with this email already exists'
				) {
					void message.error('Эта почта уже занята')
				} else {
					void message.error('Ошибка при создании администратора')
				}
			}
		}
	}

	useEffect(() => {
		if (admin) {
			form.setFieldsValue(admin)
		} else {
			form.resetFields()
		}
	}, [admin])

	return (
		<Modal
			title={admin ? 'Изменить администратора' : 'Создать администратора'}
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
				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						loading={isLoadingCreate || isLoadingUpdate}
					>
						{admin ? 'Изменить' : 'Создать'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default AdminModal
