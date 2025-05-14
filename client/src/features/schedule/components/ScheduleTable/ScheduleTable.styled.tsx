import styled from 'styled-components'

export const StyledScheduleTableWrapper = styled.div`
	.highlight-cell {
		border: 1px solid red !important;
		border-inline-end: 1px solid red !important;
	}

	@media screen and (max-width: 500px) {
		.ant-table-cell {
			padding: 8px !important;
		}
	}
`
