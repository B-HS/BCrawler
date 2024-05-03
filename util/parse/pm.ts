import * as cheerio from 'cheerio'
const pmDataMapping = {
    is_closed: 'baseList-title',
    url: 'baseList-title',
    price: '',
    shipping: '',
    title: 'baseList-title span',
    date: 'baseList-time',
    category: 'baseList-small',
    img_src: 'baseList-thumb',
} as { [key: string]: string }

const parsePm = (rawHtml: string): Article[] => {
    const $ = cheerio.load(rawHtml)
    const marketInfoLists = $('.baseList')

    return marketInfoLists
        .map((_, element) => {
            const entries = Object.entries(pmDataMapping).map(([key, className]) => {
                const title = $(element).find('div.baseList-title span').text().trim()

                switch (key) {
                    case 'img_src':
                        const tooltip = $(element).find(`.${className}`).attr('tooltip')?.split('://')[1]
                        return tooltip ? [key, `https://${tooltip}`] : [key, '']
                    case 'price':
                        return [key, title.match(/\(([^)]+)\)/)?.[1] || '']
                    case 'shipping':
                        return [key, title.match(/\(([^)]+)\)/)?.[2] || '']
                    case 'url':
                        return [key, '/' + $(element).find(`.${className}`).attr('href') || '']
                    case 'is_closed':
                        return [key, $(element).find(`.${className}`).attr('class')?.includes('end') ? 'closed' : 'open']
                    default:
                        return [key, $(element).find(`.${className}`).text().trim()]
                }
            })
            return Object.fromEntries(entries)
        })
        .get()
        .slice(0, -4)
}

export { parsePm }
