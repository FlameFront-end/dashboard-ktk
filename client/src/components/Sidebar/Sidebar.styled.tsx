import styled from 'styled-components'

interface Props {
	theme: 'dark' | 'light'
}

export const Separator = styled.div`
	height: 1px;
	margin: 5px 0;
	border-radius: 100px;
	background-color: #666;
`

export const SidebarContainer = styled.div<Props>`
	position: sticky;
	bottom: 0;
	background-color: #141414;
	transition: width 0.3s;
	width: 190px;
	padding-top: 20px;

	display: flex;
	flex-direction: column;
	gap: 7px;

	@media screen and (max-width: 800px) {
		display: none;
	}
`

export const MenuItemContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 12px 20px;
	cursor: pointer;
	transition: background-color 0.3s;
	color: #e1e3e6;
	border-radius: 10px;

	&:hover,
	&.active {
		background-color: #222222;
	}
`

export const MenuItemLabel = styled.div<Props>`
	display: block;
`

export const LogoutButton = styled.button<Props>`
	width: 100%;
	display: flex;
	margin-top: 10px;
	gap: 10px;
	align-items: center;
	justify-content: center;
	padding: 8px 16px;
	background-color: #71aaeb;
	color: #f0f0f0;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: width 0.3s;
`

export const LogoutButtonLabel = styled.div<Props>`
	display: block;
	color: #f0f0f0;
`
