const parseQuasar = (rawHtml: string) => {
    const divRegex = /<div[^>]*class="market-info-list-cont"[^>]*>(.*?)<\/div>/gs
    const matches = Array.from(rawHtml.matchAll(divRegex))

    return matches.map((match) => {
        const divContent = match[1]
        const is_closed = /<span class="label done">/.test(divContent)
        const url = divContent.match(/href="([^"]+)"/)
        const categoryMatch = divContent.match(/<span\s+class="category">([^<]+)<\/span>/)
        const titleMatch = divContent.match(/<span\s+class="ellipsis-with-reply-cnt">([^<]+)<\/span>/)
        const priceMatch = divContent.match(/<span[^>]*>\s*가격\s*<span[^>]*>\s*([^<]+)<\/span>\s*<\/span>/s)
        const shippingMatch = divContent.match(/<span>배송비\s+([^<]+)<\/span>/)
        const dateMatch = divContent.match(/<span\s+class="date">\s*(\d{2}:\d{2})\s*<\/span>/)
        const imgSrcMatch = divContent.match(/<img\s+style="[^"]+"\s+src="([^"]+)"/)

        return {
            id: url
                ? url[1]
                      .replace(/\s+/g, '')
                      .split('/')
                      .findLast(() => true)
                : '',
            is_closed,
            url: url ? url[1].replace(/\s+/g, '') : '',
            category: categoryMatch ? categoryMatch[1].replace(/\s+/g, '') : '',
            price: priceMatch ? priceMatch[1].replace(/\s+/g, '') : '',
            shipping: shippingMatch ? shippingMatch[1].replace(/\s+/g, '') : '',
            title: titleMatch ? titleMatch[1] : '',
            date: dateMatch ? dateMatch[1].replace(/\s+/g, '') : '',
            img_src: imgSrcMatch ? imgSrcMatch[1] : '',
        }
    })
}

export { parseQuasar }
