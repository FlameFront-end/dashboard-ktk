import { type FC, useEffect } from 'react'
import { Button, Input, Modal, Form, message } from 'antd'
import { useUpdateDisciplineMutation } from '../../api/disciplines.api.ts'

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    discipline: Collections.Discipline | null
    refetch: () => void
}

const EditDisciplineModal: FC<Props> = ({ open, onClose, onSuccess, discipline, refetch }) => {
    const [form] = Form.useForm()
    const [updateDiscipline, { isLoading: isLoadingUpdate }] = useUpdateDisciplineMutation()

    useEffect(() => {
        if (discipline) {
            form.setFieldsValue(discipline)
        }
    }, [discipline])

    const handleSubmit = async (values: { name: string }): Promise<void> => {
        try {
            if (discipline) {
                await updateDiscipline({ id: discipline.id, name: values.name }).unwrap()
                void message.success('Диспилина успешно изменена')
            }

            refetch()
            form.resetFields()
            onSuccess()
            onClose()
        } catch (error: any) {
            void message.error('Ошибка при редактировании диспилины')
        }
    }

    return (
        <Modal
            title='Изменить диспилину'
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    void handleSubmit(values)
                }}
            >
                <Form.Item
                    name="name"
                    label="Название"
                    rules={[{ required: true, message: 'Введите название' }]}
                >
                    <Input placeholder="Введите название" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingUpdate}>
                        Изменить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditDisciplineModal
