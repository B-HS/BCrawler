import dayjs from 'dayjs'

const formatDate = (input: string): string => {
    const today = dayjs()
    if (input.includes(':')) {
        return today.format('YYYY.MM.DD') + ` ${input}`
    } else if (input.includes('-')) {
        const parsedDate = dayjs(`${today.year()}-${input}`, 'YYYY-MM-DD')
        return parsedDate.format('YYYY.MM.DD')
    }
    return ''
}

export { formatDate }
