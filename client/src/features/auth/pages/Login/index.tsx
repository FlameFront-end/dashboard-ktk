import { type FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useAppAction } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../api/auth.api'
import type { LoginPayload } from '../../types/login.types'
import { Card } from '@/kit'
import { pathsConfig } from '@/pathsConfig'
import { PageWrapper } from '@/containers'
import { StyledAuthWrapper } from './Login.styled.tsx'

const Login: FC = () => {
	const navigate = useNavigate()
	const { setUser } = useAppAction()
	const [login, { isLoading }] = useLoginMutation()

	const [form] = Form.useForm()

	const handleFinish = (payload: LoginPayload): void => {
		void login(payload)
			.unwrap()
			.then(r => {
				setUser(r)
				form.resetFields()
				void message.success('Успешный вход в аккаунт')
				navigate(pathsConfig.group_list)
			})
			.catch(e => {
				if (e.data.message === 'Неверная почта или пароль!') {
					void message.error('Неверная почта или пароль')
				} else {
					void message.error('Что-то пошло не так')
				}
			})
	}

	return (
		<PageWrapper>
			<StyledAuthWrapper>
				<Card>
					<Form
						form={form}
						name='login'
						labelCol={{ span: 24 }}
						wrapperCol={{ span: 24 }}
						style={{ maxWidth: 400, margin: '0 auto' }}
						onFinish={(data: LoginPayload) => {
							handleFinish(data)
						}}
						autoComplete='off'
					>
						<Form.Item
							className='form-item'
							label='Почта'
							name='email'
							hasFeedback
							validateDebounce={600}
							rules={[
								{
									required: true,
									message:
										'Пожалуйста, введите свой адрес электронной почты!'
								},
								{
									type: 'email',
									message:
										'Введенный адрес электронной почты неверен!'
								}
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label='Пароль'
							name='password'
							hasFeedback
							validateDebounce={600}
							rules={[
								{
									required: true,
									message: 'Пожалуйста, введите свой пароль!'
								}
							]}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
								block
							>
								Войти
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</StyledAuthWrapper>
		</PageWrapper>
	)
}

export default Login
