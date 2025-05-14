import dayjs from 'dayjs'

const getDate = (date: string | undefined | null): dayjs.Dayjs | undefined =>
    typeof date === 'string' ? dayjs(date) : undefined

export const getDateFormat = (date: string | undefined | null): string | undefined | null => {
    const dateDayJS = getDate(date)

    return dateDayJS?.format('DD.MM.YYYY') === 'Invalid Date' ? date : dateDayJS?.format('DD.MM.YYYY')
}
