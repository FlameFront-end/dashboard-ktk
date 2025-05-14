import { type FC, type ReactNode } from 'react'
import { StyledTransparentButton } from './TransparentButton.styled.tsx'
import { CSpinner } from '@coreui/react-pro'

interface Props {
    onClick: () => void
    children: ReactNode
    className?: string
    disabled?: boolean
    isLoading?: boolean
}

const TransparentButton: FC<Props> = ({ onClick, children, className, disabled, isLoading }) => {
    return (
        <StyledTransparentButton onClick={onClick} className={className} disabled={isLoading ? true : disabled}>
            <div className="content">
                {children}
            </div>
            {isLoading && <div className='spinner-wrapper'><CSpinner color="secondary" size='sm'/></div>}
        </StyledTransparentButton>
    )
}

export default TransparentButton
