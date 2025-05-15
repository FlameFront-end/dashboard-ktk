import styled from 'styled-components'
import { Layout } from 'antd'

export const StyledHeaderWrapper = styled(Layout.Header)`
	//max-width: calc(1120px + 200px + 50px);
	margin: 0 auto;
	padding: 8px 40px;
	background-color: #141414;

	.burger-menu-button {
		display: none;
		width: 40px;
		height: 40px;

		justify-content: center;
		align-items: center;

		.burger-menu-icon {
			font-size: 22px;
			color: #fff;
			cursor: pointer;
		}
	}

	.right {
		margin-left: auto;
	}

	@media screen and (max-width: 800px) {
		padding: 4px 15px;

		.burger-menu-button {
			display: flex;
		}
	}
`
