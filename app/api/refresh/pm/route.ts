import prisma from '@/prisma/db'
import { parsePm } from '@/util/parse/pm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const POST = async () => {
    const latestRecord = await prisma.lastupdate.findFirst({
        where: { type: 'PM' },
        orderBy: { lastupdate: 'desc' },
    })
    const isAbleToUpdate = !latestRecord || Date.now() - latestRecord.lastupdate.getTime() > 3600000 / 2
    if (!isAbleToUpdate)
        return NextResponse.json({ status: `Please retry after 1 hour from the last update. \n Last update: ${latestRecord.lastupdate}` })

    // below two res.text is encoded euc-kr
    // decode it
    const decoder = new TextDecoder('euc-kr')

    const pmPCBuffer = await (await fetch('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&category=4')).arrayBuffer()
    const pmDigitalBuffer = await (await fetch('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&category=5')).arrayBuffer()
    const pmRawHtmlPC = decoder.decode(pmPCBuffer)
    const pmRawHtmlDigital = decoder.decode(pmDigitalBuffer)

    const pmJSON = [...parsePm(pmRawHtmlPC), ...parsePm(pmRawHtmlDigital)].reduce((acc, curr) => {
        if (!acc.some((article) => article.title === curr.title)) acc.push(curr)
        return acc
    }, [] as Article[])
    pmJSON.forEach((pm) => {
        const documentSrlMatch = pm.url.match(/no=(\d+)/)
        pm.id = documentSrlMatch ? documentSrlMatch[1] : ''
        pm.is_closed = pm.is_closed === 'closed'
    })
    const pmIds = pmJSON.map((pm) => pm.id)

    const pmInDb = await prisma.pm.findMany({
        where: { id: { in: pmIds } },
    })
    const pmInDbMap = new Map(pmInDb.map((pm) => [pm.id, pm]))
    const toUpdate = pmJSON.filter((pm) => pmInDbMap.has(pm.id))
    const toCreate = pmJSON.filter((pm) => !pmInDbMap.has(pm.id))

    await prisma.$transaction([
        ...toUpdate.map((pm) =>
            prisma.pm.update({
                where: { pmid: pm.id },
                data: {
                    is_closed: pm.is_closed as boolean,
                    url: pm.url,
                    category: pm.category,
                    price: pm.price,
                    shipping: pm.shipping,
                    title: pm.title,
                    date: pm.date,
                    img_src: pm.img_src,
                },
            }),
        ),
        ...toCreate.map((pm) =>
            prisma.pm.create({
                data: { pmid: pm.id, ...pm, is_closed: pm.is_closed as boolean },
            }),
        ),
    ])

    await prisma.lastupdate.create({
        data: { type: 'PM' },
    })
    return NextResponse.json({ status: 'OK' })
}
