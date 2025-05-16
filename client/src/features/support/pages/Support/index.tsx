import { type FC } from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import { useCreateTicketMutation } from '../../api/support.ts'
import { useAppSelector } from '@/hooks'
import { Card } from '@/kit'
import { PageWrapper } from '@/containers'

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
		<PageWrapper>
			<Card title='Поддержка'>
				<Typography style={{ marginBottom: 24 }}>
					<Title level={4} style={{ marginBottom: 8 }}>
						Нужна помощь?
					</Title>
					<Paragraph style={{ fontSize: 16, lineHeight: 1.5 }}>
						Если у вас возникла ошибка, напишите нам в{' '}
						<Link
							href='https://t.me/Artem_Kaliganov'
							target='_blank'
							rel='noopener noreferrer'
							style={{ fontWeight: 'bold' }}
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
							rows={5}
							placeholder='Опишите проблему или вопрос'
							style={{
								borderRadius: 8,
								fontSize: 16,
								padding: '12px 16px',
								resize: 'vertical',
								boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
								transition: 'box-shadow 0.3s ease'
							}}
							onFocus={e =>
								(e.currentTarget.style.boxShadow =
									'0 4px 12px rgba(24, 144, 255, 0.3)')
							}
							onBlur={e =>
								(e.currentTarget.style.boxShadow =
									'0 2px 8px rgba(0,0,0,0.05)')
							}
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={isLoading}
							size='large'
							style={{ borderRadius: 8, width: 'max-content' }}
						>
							Отправить
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</PageWrapper>
	)
}

export default Support
