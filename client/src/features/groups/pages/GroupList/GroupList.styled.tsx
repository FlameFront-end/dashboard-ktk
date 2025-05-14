import styled from 'styled-components'
import { Card } from '@/kit'

export const StyledGroupListWrapper = styled(Card)`
	.top-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.group-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.styled-collapse {
		margin-top: 20px;
		.ant-collapse-header {
			font-weight: bold;
		}

		.collapse-top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;

			.left {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}
		}
	}
`
