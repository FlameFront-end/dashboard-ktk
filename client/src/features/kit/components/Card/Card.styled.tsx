import styled from 'styled-components'

export const CardWrapper = styled.div`
	padding: 20px;
	background-color: ${({ theme }) => theme.card.background};
	border: 1px solid ${({ theme }) => theme.card.border};
	border-radius: 12px;

	.top_row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	@media screen and (max-width: 800px) {
		border: none;
		background-color: #19191a;
	}
`
