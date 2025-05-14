import styled from 'styled-components'

export const StyledTransparentButton = styled.button`
    color: ${({ theme }) => theme.text}; 
    background-color: transparent;
    font-weight: 700;
    border-radius: 10px;
    padding: 3px 10px;

    display: flex;
    align-items: center;    
    gap: 7px;
    
    transition: all .2s ease;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }
`
