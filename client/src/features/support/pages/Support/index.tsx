import { type FC } from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import { StyledSupportWrapper } from './Support.styled'
import { useCreateTicketMutation } from '../../api/support.ts'
import { useAppSelector } from '@/hooks'
const { Title, Paragraph, Link } = Typography

const Support: FC = () => {
	const userId = useAppSelector(state => state.auth.user.id)
	const role = useAppSelector(state => state.auth.user.role)

	const [form] = Form.useForm()
	const [createTicket, { isLoading }] = useCreateTicketMutation()

	const handleSubmit = (values: { message: string }): void => {
		if (!userId || !role) return

		void createTicket({ message: values.message, userId, userType: role })
			.unwrap()
			.then(() => {
				form.resetFields()
				void message.success('Тикет успешно создан')
			})
			.catch(() => {
				void message.error('Ошибка при создании тикета')
			})
	}

	return (
		<StyledSupportWrapper title='Поддержка'>
			<Typography>
				<Title level={4}>Нужна помощь?</Title>
				<Paragraph>
					Если у вас возникла ошибка, напишите нам в{' '}
					<Link
						href='https://t.me/Artem_Kaliganov'
						target='_blank'
						rel='noopener noreferrer'
					>
						Telegram
					</Link>{' '}
					или воспользуйтесь формой ниже.
				</Paragraph>
			</Typography>

			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Form.Item
					name='message'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите сообщение'
						}
					]}
				>
					<Input.TextArea
						rows={4}
						placeholder='Опишите проблему или вопрос'
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						loading={isLoading}
					>
						Отправить
					</Button>
				</Form.Item>
			</Form>
		</StyledSupportWrapper>
	)
}

export default Support
