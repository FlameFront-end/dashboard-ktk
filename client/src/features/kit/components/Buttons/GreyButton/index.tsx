import { type FC, type ReactNode } from 'react'
import { StyledGreyButton } from './GreyButton.styled.tsx'

interface Props {
    onClick: () => void
    children: ReactNode
    className?: string
}

const GreyButton: FC<Props> = ({ onClick, children, className }) => {
    return (
        <StyledGreyButton onClick={onClick} className={className}>
            {children}
        </StyledGreyButton>
    )
}

export default GreyButton
