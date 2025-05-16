import styled from 'styled-components'

interface Props {
	theme: 'dark' | 'light'
}

export const Separator = styled.hr`
	margin: 5px 0;
	border: none;
	border-top: 1px solid #ccc;
	width: 100%;
`

export const SidebarContainer = styled.div<Props>`
	position: sticky;
	bottom: 0;
	background-color: #141414;
	transition: width 0.3s;
	width: 190px;
	padding-top: 20px;

	height: calc(100vh - 100px);

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

	margin-top: auto;
`

export const LogoutButtonLabel = styled.div<Props>`
	display: block;
	color: #f0f0f0;
`

export const MobileSidebarOverlay = styled.div<{ $visible: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: ${({ $visible }) => ($visible ? '100%' : '0')};
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	overflow: hidden;
	z-index: 999;
	transition: width 0.3s ease-in-out;
`

export const MobileSidebarContent = styled.div`
	width: 300px;
	background-color: #141414;
	height: 100%;
	padding: 16px;
	position: fixed;
	top: 0;
	left: 0;
`

export const CloseButton = styled.div`
	font-size: 24px;
	color: white;
	text-align: right;
	cursor: pointer;
`
export const MenuItemsWrapper = styled.div`
	flex-grow: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 7px;

	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`
