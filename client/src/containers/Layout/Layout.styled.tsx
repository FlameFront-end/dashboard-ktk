import styled from 'styled-components'
import { Layout } from 'antd'

export const StyledLayout = styled(Layout)`
	position: relative;
	min-height: calc(100vh - 64px);
	//max-width: calc(1120px + 200px + 50px);
	display: flex;
	gap: 16px;
	padding: 20px;
	background-color: #141414;
	margin: 0 auto;

	@media screen and (max-width: 800px) {
		padding: 10px;
	}
`

export const StyledContent = styled(Layout.Content)`
	margin: 16px 16px 0;
	background-color: #141414;

	@media screen and (max-width: 800px) {
		margin: 0;
	}
`
