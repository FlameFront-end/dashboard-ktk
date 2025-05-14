import { type FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import { StyledMobileNavBottomWrapper } from './MobileNavBottom.styled.tsx'
import { useAppSelector } from '@/hooks'

const MobileNavBottom: FC = () => {
    const groupId = useAppSelector(state => state.auth.user.groupId)

    const loc = useLocation()
    const locName = loc.pathname.split('/')[1]

    return (
        <StyledMobileNavBottomWrapper>
            {!!groupId && (
                <Link to={pathsConfig.group} state={{ id: groupId }} className={`link ${locName === 'students' ? 'active' : ''}`}>
                    <div className='content'>
                Моя группа
                    </div>
                </Link>
            )}

            <Link to={pathsConfig.group_list} className={`link ${locName === 'groups' ? 'active' : ''}`}>
                <div className='content'>
              Группы
                </div>
            </Link>

            <Link to={pathsConfig.teachers_list} className={`link ${locName === 'teachers' ? 'active' : ''}`}>
                <div className='content'>
              Преподаватели
                </div>
            </Link>

            <Link to={pathsConfig.students_list} className={`link ${locName === 'students' ? 'active' : ''}`}>
                <div className='content'>
              Студенты
                </div>
            </Link>
        </StyledMobileNavBottomWrapper>
    )
}

export default MobileNavBottom
