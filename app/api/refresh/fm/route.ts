import prisma from '@/prisma/db'
import { parseFm } from '@/util/parse/fm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const POST = async () => {
    const latestRecord = await prisma.lastupdate.findFirst({
        where: { type: 'FM' },
        orderBy: { lastupdate: 'desc' },
    })
    const isAbleToUpdate = !latestRecord || Date.now() - latestRecord.lastupdate.getTime() > 3600000 / 2
    if (!isAbleToUpdate)
        return NextResponse.json({ status: `Please retry after 1 hour from the last update. \n Last update: ${latestRecord.lastupdate}` })

    const fmRawHtmlPC = await fetch('https://www.fmkorea.com/index.php?mid=hotdeal&category=1254381811').then((res) => res.text())
    const fmRawHtmlDigital = await fetch('https://www.fmkorea.com/index.php?mid=hotdeal&category=1196845148').then((res) => res.text())

    const fmJSON = [...parseFm(fmRawHtmlPC), ...parseFm(fmRawHtmlDigital)].reduce((acc, curr) => {
        if (!acc.some((article) => article.title === curr.title)) acc.push(curr)
        return acc
    }, [] as Article[])
    fmJSON.forEach((fm) => {
        const documentSrlMatch = fm.url.match(/document_srl=(\d+)/)
        fm.id = documentSrlMatch ? documentSrlMatch[1] : ''
        fm.is_closed = fm.is_closed === 'closed'
    })
    const fmIds = fmJSON.map((fm) => fm.id)

    const fmInDb = await prisma.fm.findMany({
        where: { id: { in: fmIds } },
        orderBy: { id: 'desc' },
    })
    const fmInDbMap = new Map(fmInDb.map((fm) => [fm.id, fm]))
    const toUpdate = fmJSON.filter((fm) => fmInDbMap.has(fm.id))
    const toCreate = fmJSON.filter((fm) => !fmInDbMap.has(fm.id))

    await prisma.$transaction([
        ...toUpdate.map((fm) =>
            prisma.fm.update({
                where: { fmid: fm.id },
                data: {
                    is_closed: fm.is_closed as boolean,
                    url: fm.url,
                    category: fm.category,
                    price: fm.price,
                    shipping: fm.shipping,
                    title: fm.title,
                    date: fm.date,
                    img_src: fm.img_src,
                },
            }),
        ),
        ...toCreate.map((fm) =>
            prisma.fm.create({
                data: { fmid: fm.id, ...fm, is_closed: fm.is_closed as boolean },
            }),
        ),
    ])

    await prisma.lastupdate.create({
        data: { type: 'FM' },
    })
    return NextResponse.json({ status: 'OK' })
}
