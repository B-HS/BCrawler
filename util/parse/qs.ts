import * as cheerio from 'cheerio'
const qdDataMapping = {
    is_closed: 'label',
    url: 'subject-link',
    category: 'category',
    price: 'text-orange',
    shipping: 'shipping',
    title: 'ellipsis-with-reply-cnt',
    date: 'date',
    img_src: 'maxImg',
} as { [key: string]: string }

const parseQuasar = (rawHtml: string): Article[] => {
    const $ = cheerio.load(rawHtml)
    const marketInfoLists = $('.market-info-list')

    return marketInfoLists
        .map((_, element) => {
            const entries = Object.entries(qdDataMapping).map(([key, className]) => {
                switch (key) {
                    case 'img_src':
                        return [key, $(element).find('div.thumb-wrap a img').attr('src') || '']
                    case 'url':
                        return [key, $(element).find(`.${className}`).attr('href') || '']
                    case 'shipping':
                        const spanText = $(element)
                            .find('span')
                            .filter((_, el) => Object.keys(el.attribs).length === 0)
                            .text()
                            .split('배송비')
                            .pop()
                            ?.trim()
                        return [key, spanText || '']
                    default:
                        return [key, $(element).find(`.${className}`).text().trim()]
                }
            })
            return Object.fromEntries(entries)
        })
        .get()
}

export { parseQuasar }
