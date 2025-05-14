import { type FC } from 'react'
import { StyledGradesChartWrapper } from './GradesChart.styled.tsx'
import LineChart from '../Charts/LineChart'
import PieChart from '../Charts/PieChart'

interface Props {
    data: Collections.DisciplineGrades
}

const GradesChart: FC<Props> = ({ data }) => {
    return (
        <StyledGradesChartWrapper>
            <div className='item'>
                <LineChart grades={data.grades} />
            </div>

            <div className='item'>
                <PieChart grades={data.grades} />
            </div>
        </StyledGradesChartWrapper>
    )
}

export default GradesChart
