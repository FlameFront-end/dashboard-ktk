import styled from 'styled-components'
import { Layout } from 'antd'

export const StyledHeaderWrapper = styled(Layout.Header)`
	//max-width: calc(1120px + 200px + 50px);
	margin: 0 auto;
	padding: 8px 40px;
	background-color: #141414;

	.burger-menu-icon {
		font-size: 24px;
		color: #fff;
		cursor: pointer;
		display: none;
	}

	@media screen and (max-width: 800px) {
		padding: 4px 15px;

		.burger-menu-icon {
			display: block;
		}
	}
`
