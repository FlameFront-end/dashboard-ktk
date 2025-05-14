import styled from 'styled-components'

export const StyledAccentButton = styled.button`
    display: flex;
    align-items: center;
    gap: 7px;

    border-radius: 8px;
    padding: 0 16px;
    background-color: #e1e3e6;
    
    color: ${({ theme }) => theme.revert_text};
    font-size: 14px;
    font-weight: 500;
    
    &:disabled {
        opacity: .6;
    }
`
