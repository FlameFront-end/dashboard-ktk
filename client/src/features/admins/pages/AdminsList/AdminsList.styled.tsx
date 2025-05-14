import styled from 'styled-components'
import { Card } from '@/kit'

export const StyledAdminsListWrapper = styled(Card)`
	.top-row {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: center;

		@media screen and (max-width: 600px) {
			flex-direction: column;
			align-items: start;
			gap: 10px;
		}
	}
`
