import styled from 'styled-components'
import { Layout } from 'antd'

export const StyledLayout = styled(Layout)`
	position: relative;
	min-height: calc(100vh - 64px);
	display: flex;
	gap: 24px;
	padding: 0 16px;
	background-color: #141414;
	margin: 0 auto;

	@media screen and (max-width: 800px) {
		padding: 0 8px;
	}
`

export const StyledContent = styled(Layout.Content)`
	background-color: #141414;
	margin-bottom: 16px;

	@media screen and (max-width: 800px) {
		margin-bottom: 8px;
	}
`
