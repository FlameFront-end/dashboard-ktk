import { type FC, type ReactNode } from 'react'
import { StyledAccentButton } from './AccentButton.styled.tsx'
import { CSpinner } from '@coreui/react-pro'

interface Props {
    onClick: () => void
    children: ReactNode
    className?: string
    disabled?: boolean
    isLoading?: boolean
}

const AccentButton: FC<Props> = ({ onClick, children, className, disabled, isLoading }) => {
    return (
        <StyledAccentButton onClick={onClick} className={className} disabled={isLoading ? true : disabled}>
            <div className="content">
                {children}
            </div>
            {isLoading && <div className='spinner-wrapper'><CSpinner color="secondary" size='sm'/></div>}
        </StyledAccentButton>
    )
}

export default AccentButton
