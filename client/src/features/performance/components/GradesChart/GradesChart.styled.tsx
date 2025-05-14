import styled from 'styled-components'

export const StyledGradesChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    
    .item {
        width: 100%;
        
        .circle {
            width: 300px !important;
            height: auto !important;
        }
        
        .line {
            height: 300px !important;
        }
    }
`
