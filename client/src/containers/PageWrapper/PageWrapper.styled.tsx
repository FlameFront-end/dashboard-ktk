import styled from 'styled-components'

export const StyledPageWrapper = styled.div`
	height: calc(100vh - 80px);
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`
