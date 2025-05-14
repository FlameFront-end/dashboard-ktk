import { type FC, useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { pathsConfig } from '@/pathsConfig'
import {
	useEditLessonMutation,
	useGetLessonQuery
} from '../../api/lessons.api.ts'
import { Card } from '@/kit'
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'

interface LessonData {
	title: string
	description: string
	homework: string
	files?: Array<RcFile | UploadFile>
}

const EditLesson: FC = () => {
	const [form] = useForm()
	const { state } = useLocation()
	const navigate = useNavigate()

	const date: string = state.date
	const groupId: string = state.groupId
	const disciplineId: string = state.disciplineId
	const lessonId: string = state.lessonId

	const { data: lesson, refetch: refetchLesson } = useGetLessonQuery(lessonId)
	const [editLesson] = useEditLessonMutation()
	const [fileList, setFileList] = useState<Array<RcFile | UploadFile>>([])

	useEffect(() => {
		if (lesson) {
			form.setFieldsValue({
				title: lesson.title,
				description: lesson.description,
				homework: lesson.homework
			})

			if (lesson.files && lesson.files.length > 0) {
				const filesFromServer = lesson.files
					.filter((file: any) => file.url)
					.map((file: any, index: number) => ({
						uid: `-${index}`,
						status: 'done' as const,
						name: file.originalName || `file-${index}`,
						url: file.url
					}))
				setFileList(filesFromServer)
			} else {
				setFileList([])
			}
		}
	}, [lesson, form])

	const onFinish = (values: LessonData): void => {
		const formData = new FormData()
		formData.append('id', lessonId)
		formData.append('title', values.title)
		formData.append('description', values.description || '')
		formData.append('homework', values.homework || '')
		formData.append('disciplineId', disciplineId)
		formData.append('groupId', groupId)
		formData.append('date', date)

		const filesData: any[] = []

		fileList.forEach(file => {
			if ('url' in file && file.url) {
				filesData.push({ originalName: file.name, url: file.url })
			} else if ('originFileObj' in file && file.originFileObj) {
				formData.append('files', file.originFileObj)
			}
		})

		formData.append('files', JSON.stringify(filesData))

		editLesson(formData)
			.unwrap()
			.then(() => {
				void message.success('Лекция успешно изменена')
				void refetchLesson()
				navigate(pathsConfig.group, {
					state: { id: groupId, tab: '3' }
				})
			})
			.catch(() => {
				void message.error('Ошибка при изменении лекции')
			})
	}

	const onUploadChange = (info: UploadChangeParam): void => {
		setFileList(info.fileList)
	}

	const onRemove = (file: UploadFile): void => {
		setFileList(prev => prev.filter(f => f.uid !== file.uid))
	}

	return (
		<Card>
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

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					label='Тема лекции'
					name='title'
					rules={[{ required: true, message: 'Введите тему лекции' }]}
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
						name='files'
						beforeUpload={() => false}
						fileList={fileList}
						onChange={onUploadChange}
						onRemove={onRemove}
						maxCount={10}
					>
						<Button icon={<UploadOutlined />}>Выбрать файлы</Button>
					</Upload>
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Изменить
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default EditLesson
