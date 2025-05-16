import { type FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useAppAction } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../api/auth.api'
import type { LoginPayload } from '../../types/login.types'
import { Card } from '@/kit'
import { StyledAuthWrapper } from './Login.styled.tsx'
import { pathsConfig } from '@/pathsConfig'
import { PageWrapper } from '@/containers'

const Login: FC = () => {
	const navigate = useNavigate()
	const { setUser } = useAppAction()
	const [login, { isLoading }] = useLoginMutation()

	const [form] = Form.useForm()

	const handleFinish = async (payload: LoginPayload): Promise<void> => {
		const response = await login(payload)

		if (!('error' in response)) {
			const result = response?.data
			setUser(result)
			form.resetFields()
			void message.success('Успешный вход в аккаунт')
			navigate(pathsConfig.group_list)
		} else {
			void message.error('Что-то пошло не так')
		}
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
							void handleFinish(data)
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
