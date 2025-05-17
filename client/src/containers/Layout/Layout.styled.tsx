import styled from 'styled-components'
import { Layout } from 'antd'

export const StyledLayout = styled(Layout)`
	position: relative;
	min-height: calc(100vh - 64px);
	display: flex;
	gap: 24px;
	padding: 0 16px;
	margin: 0 auto;
	background-color: #141414;

	@media screen and (max-width: 800px) {
		padding: 0 8px;
	}
`

export const StyledContent = styled(Layout.Content)`
	margin-bottom: 16px;
	background-color: #141414;

	@media screen and (max-width: 800px) {
		margin-bottom: 8px;
	}
`
