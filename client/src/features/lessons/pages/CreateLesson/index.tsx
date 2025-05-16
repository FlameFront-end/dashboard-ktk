import { type FC, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { pathsConfig } from '@/pathsConfig'
import { useCreateLessonsMutation } from '../../api/lessons.api.ts'
import { Card } from '@/kit'
import type { RcFile, UploadChangeParam } from 'antd/es/upload'
import { PageWrapper } from '@/containers'

interface LessonData {
	title: string
	description: string
	homework: string
	files?: File[]
}

const CreateLesson: FC = () => {
	const [form] = useForm()
	const { state } = useLocation()
	const navigate = useNavigate()
	const date: string = state.date
	const groupId: string = state.groupId
	const disciplineId: string = state.disciplineId
	const [createLesson] = useCreateLessonsMutation()
	const [fileList, setFileList] = useState<RcFile[]>([])

	const onFinish = (values: LessonData): void => {
		const formData = new FormData()
		formData.append('title', values.title)
		formData.append('description', values.description || '')
		formData.append('homework', values.homework || '')
		formData.append('disciplineId', disciplineId)
		formData.append('groupId', groupId)
		formData.append('date', date)

		fileList.forEach(file => {
			formData.append('files', file)
		})

		void createLesson(formData)
			.unwrap()
			.then(() => {
				void message.success('Лекция успешно создана')
				navigate(pathsConfig.group, {
					state: { id: groupId, tab: '3' }
				})
			})
			.catch(() => {
				void message.error('Ошибка при создании лекции')
			})
	}

	const onUploadChange = (info: UploadChangeParam): void => {
		const files = info.fileList
			.filter(file => !!file.originFileObj)
			.map(file => file.originFileObj as RcFile)
		setFileList(prevState => [...prevState, ...files])
	}

	return (
		<PageWrapper>
			<Card title='Создание лекции'>
				<Button
					type='dashed'
					onClick={() => {
						navigate(pathsConfig.lessons, {
							state: { id: groupId, tab: disciplineId }
						})
					}}
					style={{ marginBottom: 10 }}
				>
					Назад
				</Button>

				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					autoComplete='off'
				>
					<Form.Item
						label='Тема лекции'
						name='title'
						rules={[
							{ required: true, message: 'Введите тему лекции' }
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item label='Описание' name='description'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item label='Домашнее задание' name='homework'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item label='Файлы'>
						<Upload
							multiple
							beforeUpload={() => false}
							fileList={fileList}
							onChange={onUploadChange}
							maxCount={10}
						>
							<Button icon={<UploadOutlined />}>
								Выбрать файлы
							</Button>
						</Upload>
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Создать
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</PageWrapper>
	)
}

export default CreateLesson
