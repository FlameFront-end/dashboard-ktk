import styled from 'styled-components'
import { Card } from '@/kit'

export const StyledChatWrapper = styled(Card)`
	display: flex;
	flex-direction: column;
	height: calc(100vh - 120px);

	overflow-y: hidden !important;

	.message-list {
		flex: 1;
		overflow-y: auto;
		padding: 10px;

		-ms-overflow-style: none;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.message-left,
	.message-right {
		margin-bottom: 10px;
	}

	.message-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.message-right .ant-list-item-meta {
		text-align: right;
	}

	.message-right .ant-list-item-meta-avatar {
		order: 1;
		margin-right: 0;
		margin-left: 10px;
	}

	.chat-input-area {
		display: flex;
		align-items: center;
		padding: 10px;
	}

	.chat-input {
		flex: 1;
		margin-right: 10px;
	}

	.ant-avatar {
		font-size: 16px;
		color: white;
		background-color: #1890ff;
	}
`
