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

const fmDataMapping = {
    is_closed: '',
    url: '',
    price: '',
    shipping: '',
    img_src: '',
    date: '.regdate',
    title: 'h3.title a',
    category: '.category a',
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

const parseFm = (rawHtml: string): Article[] => {
    const $ = cheerio.load(rawHtml)
    const marketInfoLists = $('.li_best2_pop0')

    return marketInfoLists
        .map((_, element) => {
            const entries = Object.entries(fmDataMapping).map(([key, className]) => {
                switch (key) {
                    case 'img_src':
                        return [key, `https:${$(element).find('.thumb').attr('data-original') || ''}`]
                    case 'url':
                        return [key, $(element).find('a').attr('href') || '']
                    case 'shipping':
                        return [
                            key,
                            $(element)
                                .find('.hotdeal_info span')
                                .eq(2)
                                .text()
                                .trim()
                                .replace(/^배송:\s*/, ''),
                        ]
                    case 'price':
                        return [
                            key,
                            $(element)
                                .find('.hotdeal_info span')
                                .eq(1)
                                .text()
                                .trim()
                                .replace(/^가격:\s*/, ''),
                        ]
                    case 'is_closed':
                        return [key, $(element).find('h3.title a').attr('class')?.includes('hotdeal_var8Y') ? 'closed' : 'open']
                    default:
                        return [key, $(element).find(`${className}`).text().trim()]
                }
            })
            const convertedData = Object.fromEntries(entries)
            convertedData.title = convertedData.title.replace(/\s+/g, ' ').trim() // Remove extra spaces and line breaks
            convertedData.title = convertedData.title.replace(/\s*\[\d+\]/, '')

            return convertedData
        })
        .get()
}
export { parseFm, parseQuasar }
