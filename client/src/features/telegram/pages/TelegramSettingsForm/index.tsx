import { type FC, useEffect, useState } from 'react'
import {
	Form,
	Input,
	Button,
	Checkbox,
	message,
	Typography,
	Divider,
	Space,
	Card,
	Collapse
} from 'antd'
import { axiosInstance } from '@/core'
import { PageWrapper } from '@/containers'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

export const TelegramSettingsForm: FC = () => {
	const [form] = Form.useForm()
	const [verified, setVerified] = useState(false)

	useEffect(() => {
		axiosInstance
			.get('/telegram/settings')
			.then(response => {
				const settings = response.data
				if (settings) {
					form.setFieldsValue({
						token: settings.token,
						scheduleChange: settings.settings?.scheduleChange,
						newMessage: settings.settings?.newMessage,
						gradeUpdate: settings.settings?.gradeUpdate,
						newGrade: settings.settings?.newGrade,
						newStudent: settings.settings?.newStudent,
						groupCreation: settings.settings?.groupCreation,
						studentAddedToGroup:
							settings.settings?.studentAddedToGroup,
						studentRemovedFromGroup:
							settings.settings?.studentRemovedFromGroup,
						groupNameChange: settings.settings?.groupNameChange,
						groupRemoval: settings.settings?.groupRemoval,
						newLesson: settings.settings?.newLesson,
						lessonUpdate: settings.settings?.lessonUpdate,
						lessonRemoved: settings.settings?.lessonRemoved
					})
					setVerified(true)
				}
			})
			.catch(error => {
				console.error('Ошибка при загрузке настроек Telegram:', error)
			})
	}, [])

	const onVerify = (): void => {
		const token = form.getFieldValue('token')
		axiosInstance
			.post('/telegram/verify', { token })
			.then(() => {
				void axiosInstance
					.post('/telegram/settings', {
						token
					})
					.then(() => {
						setVerified(true)
						void message.success('Бот успешно подключён')
					})
					.catch(error => {
						if (
							error.response.data.message ===
							'Невозможно получить chatId, отправьте сообщение боту'
						) {
							void message.error(
								'Отправьте сообщение боту, это нужно для инициализации'
							)
						} else {
							void message.error('Что-то пошло не так')
						}
					})
			})
			.catch(error => {
				console.error(error)
				void message.error('Ошибка в токене')
			})
	}

	const onFinish = (values: any): void => {
		axiosInstance
			.post('/telegram/settings', values)
			.then(() => {
				void message.success('Настройки сохранены')
			})
			.catch(error => {
				if (
					error.response.data.message ===
					'Невозможно получить chatId, отправьте сообщение боту'
				) {
					void message.error(
						'Отправьте сообщение боту, это нужно для инициализации'
					)
				} else {
					void message.error('Что-то пошло не так')
				}
			})
	}

	return (
		<PageWrapper>
			<Typography>
				<Title level={4}>Инструкция по подключению Telegram-бота</Title>
				<Paragraph>
					Вы можете подключить своего Telegram-бота, чтобы получать
					уведомления о событиях, связанных с вашим аккаунтом.
				</Paragraph>
				<Paragraph>
					<b>Шаг 1:</b> Создайте бота через{' '}
					<a
						href='https://t.me/BotFather'
						target='_blank'
						rel='noopener noreferrer'
					>
						@BotFather
					</a>{' '}
					и получите токен.
				</Paragraph>
				<Paragraph>
					<b>Шаг 2:</b> Введите токен ниже и нажмите кнопку{' '}
					<Text keyboard>Проверить и подключить</Text>.
				</Paragraph>
				<Paragraph>
					<b>Шаг 3:</b> Перейдите в Telegram и отправьте{' '}
					<Text code>любое сообщение</Text> своему боту, чтобы система
					получила ваш <Text code>chatId</Text>.
				</Paragraph>
				<Paragraph>
					<b>Шаг 4:</b> После подключения выберите, какие уведомления
					вы хотите получать, и сохраните настройки.
				</Paragraph>
				<Divider />
			</Typography>

			<Form form={form} onFinish={onFinish} layout='vertical'>
				<Form.Item
					name='token'
					label='Токен бота'
					rules={[
						{
							required: true,
							message: 'Введите токен бота'
						}
					]}
					style={{ maxWidth: '400px' }}
				>
					<Input
						disabled={verified}
						placeholder='Введите токен, выданный @BotFather'
						type='password'
						aria-autocomplete='none'
						autoComplete='none'
					/>
				</Form.Item>

				<Button type='default' onClick={onVerify} disabled={verified}>
					Проверить и подключить
				</Button>

				<Divider />

				{verified && (
					<Card
						size='small'
						style={{ maxWidth: '500px', width: '100%' }}
					>
						<Divider orientation='center'>
							Настройки уведомлений
						</Divider>

						<Collapse defaultActiveKey={['1', '2', '3']} ghost>
							<Panel header='Расписание и оценки' key='1'>
								<Space
									direction='vertical'
									style={{ width: '100%' }}
								>
									<Form.Item
										name='scheduleChange'
										valuePropName='checked'
									>
										<Checkbox>
											Изменения в расписании
										</Checkbox>
									</Form.Item>
									<Form.Item
										name='gradeUpdate'
										valuePropName='checked'
									>
										<Checkbox>Изменения оценок</Checkbox>
									</Form.Item>
									<Form.Item
										name='newGrade'
										valuePropName='checked'
									>
										<Checkbox>Новые оценки</Checkbox>
									</Form.Item>
								</Space>
							</Panel>

							<Panel header='Группы' key='2'>
								<Space
									direction='vertical'
									style={{ width: '100%' }}
								>
									<Form.Item
										name='groupCreation'
										valuePropName='checked'
									>
										<Checkbox>Создание группы</Checkbox>
									</Form.Item>
									<Form.Item
										name='groupNameChange'
										valuePropName='checked'
									>
										<Checkbox>
											Изменение названия группы
										</Checkbox>
									</Form.Item>
									<Form.Item
										name='groupRemoval'
										valuePropName='checked'
									>
										<Checkbox>Удаление группы</Checkbox>
									</Form.Item>
									<Form.Item
										name='studentAddedToGroup'
										valuePropName='checked'
									>
										<Checkbox>Добавление в группу</Checkbox>
									</Form.Item>
									<Form.Item
										name='studentRemovedFromGroup'
										valuePropName='checked'
									>
										<Checkbox>Удаление из группы</Checkbox>
									</Form.Item>
								</Space>
							</Panel>

							<Panel header='Лекции и сообщения' key='3'>
								<Space
									direction='vertical'
									style={{ width: '100%' }}
								>
									<Form.Item
										name='newMessage'
										valuePropName='checked'
									>
										<Checkbox>
											Новые сообщения в чате
										</Checkbox>
									</Form.Item>
									<Form.Item
										name='newStudent'
										valuePropName='checked'
									>
										<Checkbox>Новые ученики</Checkbox>
									</Form.Item>
									<Form.Item
										name='newLesson'
										valuePropName='checked'
									>
										<Checkbox>Новые лекции</Checkbox>
									</Form.Item>
									<Form.Item
										name='lessonUpdate'
										valuePropName='checked'
									>
										<Checkbox>Изменения в лекциях</Checkbox>
									</Form.Item>
									<Form.Item
										name='lessonRemoved'
										valuePropName='checked'
									>
										<Checkbox>Удаление лекций</Checkbox>
									</Form.Item>
								</Space>
							</Panel>
						</Collapse>

						<Divider />

						<Button type='primary' htmlType='submit' block>
							Сохранить настройки
						</Button>
					</Card>
				)}
			</Form>
		</PageWrapper>
	)
}
