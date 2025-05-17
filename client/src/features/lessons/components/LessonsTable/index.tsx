import { type FC, type ReactNode, useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Card, message, Space, Table, Tag, Typography } from 'antd'
import { pathsConfig } from '@/pathsConfig'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@/kit'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/hooks'
import ReactMarkdown from 'react-markdown'
import { axiosInstance } from '@/core'
import { weekdays } from '@/constants'

interface Props {
	lessons: any[]
	disciplineId: string
	groupId: string
	currentWeekStart: moment.Moment
	schedule: any
	groupTeacherId: string | undefined
}

const LessonsTable: FC<Props> = ({
	lessons,
	disciplineId,
	groupId,
	currentWeekStart,
	schedule,
	groupTeacherId
}) => {
	const navigate = useNavigate()
	const role = useAppSelector(state => state.auth.user.role)
	const myId = useAppSelector(state => state.auth.user.id)

	const [lessonsData, setLessonsData] = useState<Collections.Lesson[]>([])

	const fetchLessons = (): void => {
		axiosInstance
			.get(`/lessons/${groupId}/${disciplineId}`)
			.then(r => {
				setLessonsData(r.data)
			})
			.catch(() => {
				void message.error('Ошибка при загрузке лекций.')
			})
	}

	const findLessonByDate = (date: string): Collections.Lesson | null => {
		return lessonsData.find(lesson => lesson.date === date) ?? null
	}

	const handleCreateLesson = (date: string): void => {
		navigate(pathsConfig.create_lesson, {
			state: { date, groupId, disciplineId }
		})
	}

	const handleEditLesson = (date: string, lessonId: string): void => {
		navigate(pathsConfig.edit_lesson, {
			state: { date, groupId, disciplineId, lessonId }
		})
	}

	useEffect(() => {
		fetchLessons()
	}, [groupId, disciplineId])

	const generateTableData = (): ReactNode => {
		const lessonTeacherId = lessons[0]?.teacher?.id

		const uniqueDates = new Set<string>()
		lessons.forEach(lesson => {
			weekdays.forEach((day, index) => {
				const lessonsForDay = schedule[day]
				if (
					Array.isArray(lessonsForDay) &&
					lessonsForDay.some(
						entry => entry.discipline?.id === lesson.discipline?.id
					)
				) {
					const date = currentWeekStart
						.clone()
						.add(index, 'days')
						.toISOString()
					uniqueDates.add(date)
				}
			})
		})

		const lessonDates: moment.Moment[] = [...uniqueDates].map(dateString =>
			moment(dateString)
		)

		const columns = lessonDates.map(date => ({
			title: date.format('DD.MM'),
			dataIndex: date.format('DD.MM'),
			key: date.format('DD.MM'),
			onCell: () => ({
				style: { verticalAlign: 'top' }
			}),
			render: () => {
				const formattedDate = date.format('YYYY-MM-DD')
				const lesson = findLessonByDate(formattedDate)

				const canEdit =
					role === 'admin' ||
					myId === groupTeacherId ||
					myId === lessonTeacherId

				if (!lesson) {
					return canEdit ? (
						<Button
							onClick={() => {
								handleCreateLesson(formattedDate)
							}}
						>
							Создать
						</Button>
					) : (
						<div>-</div>
					)
				}

				return (
					<div style={{ width: '300px', minHeight: '100%' }}>
						<Card
							size='small'
							bordered={true}
							style={{ width: 320, minHeight: 220, padding: 8 }}
						>
							<Space
								direction='vertical'
								size='small'
								style={{ width: '100%' }}
							>
								<Typography.Paragraph style={{ margin: 0 }}>
									<b>Название:</b> {lesson.title}
								</Typography.Paragraph>

								<Typography.Paragraph style={{ margin: 0 }}>
									<b>Описание:</b>
									<ReactMarkdown>
										{lesson.description || ''}
									</ReactMarkdown>
								</Typography.Paragraph>

								<Typography.Paragraph style={{ margin: 0 }}>
									<b>Домашнее задание:</b>
									<ReactMarkdown>
										{lesson.homework || ''}
									</ReactMarkdown>
								</Typography.Paragraph>

								{!!lesson?.files?.length &&
									lesson.files.length > 0 && (
										<Flex direction='column'>
											<Typography.Text strong>
												Файлы:
											</Typography.Text>
											<Flex direction='column'>
												{lesson?.files.map(
													(file, index) => (
														<Tag
															key={index}
															style={{
																padding:
																	'5px 10px',
																width: 'max-content'
															}}
														>
															<a
																href={file.url}
																target='_blank'
																rel='noopener noreferrer'
															>
																{
																	file.originalName
																}
															</a>
														</Tag>
													)
												)}
											</Flex>
										</Flex>
									)}
							</Space>

							{canEdit && (
								<Button
									icon={<EditOutlined />}
									onClick={() => {
										handleEditLesson(
											formattedDate,
											lesson.id
										)
									}}
								>
									Редактировать
								</Button>
							)}
						</Card>
					</div>
				)
			}
		}))

		return (
			<Table
				columns={columns}
				dataSource={[{ key: 'lessons' }]}
				pagination={false}
				scroll={{ x: 'max-content' }}
			/>
		)
	}

	return generateTableData()
}

export default LessonsTable
