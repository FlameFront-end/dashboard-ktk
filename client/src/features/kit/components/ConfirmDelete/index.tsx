import { type FC } from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface Props {
    title: string
    handleDelete: () => Promise<void>
    isLoading?: boolean
}

const ConfirmDelete: FC<Props> = ({ title, handleDelete, isLoading = false }) => {
    return (
        <Popconfirm
            title={title}
            onConfirm={() => {
                void handleDelete()
            }}
            okText="Да"
            cancelText="Нет"
            overlayStyle={{
                backgroundColor: '#333333',
                color: '#e1e3e6',
                borderColor: '#363738'
            }}
            okButtonProps={{
                style: {
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff'
                }
            }}
            cancelButtonProps={{
                style: {
                    backgroundColor: '#444444',
                    borderColor: '#444444'
                }
            }}
        >
            <Button
                type="text"
                icon={<DeleteOutlined />}
                loading={isLoading}
                danger
                style={{
                    color: '#e1e3e6',
                    borderColor: '#363738'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#555555'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                }}
            />
        </Popconfirm>
    )
}

export default ConfirmDelete
