import prisma from '@/prisma/db'
import { parseQuasar } from '@/util/parse/qs'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const POST = async () => {
    const latestRecord = await prisma.lastupdate.findFirst({
        where: { type: 'QS' },
        orderBy: { lastupdate: 'desc' },
    })
    const isAbleToUpdate = !latestRecord || Date.now() - latestRecord.lastupdate.getTime() > 3600000 / 2
    if (!isAbleToUpdate)
        return NextResponse.json({ status: `Please retry after 1 hour from the last update. \n Last update: ${latestRecord.lastupdate}` })

    const qsRawHtml = await fetch('https://quasarzone.com/bbs/qb_saleinfo').then((res) => res.text())
    const qsJSON = parseQuasar(qsRawHtml).filter((qs) => qs.title)
    qsJSON.forEach((qs) => {
        qs.id = qs.url.split('/').pop() || ''
        console.log(qs.is_closed)
        qs.is_closed = qs.is_closed === '종료'
    })
    const qsIds = qsJSON.map((qs) => qs.id)

    const qsInDb = await prisma.qs.findMany({
        where: { id: { in: qsIds } },
        orderBy: { id: 'desc' },
    })
    const qsInDbMap = new Map(qsInDb.map((qs) => [qs.id, qs]))
    const toUpdate = qsJSON.filter((qs) => qsInDbMap.has(qs.id))
    const toCreate = qsJSON.filter((qs) => !qsInDbMap.has(qs.id))

    await prisma.$transaction([
        ...toUpdate.map((qs) =>
            prisma.qs.update({
                where: { qsid: qs.id },
                data: {
                    is_closed: qs.is_closed as boolean,
                    url: qs.url,
                    category: qs.category,
                    price: qs.price,
                    shipping: qs.shipping,
                    title: qs.title,
                    date: qs.date,
                    img_src: qs.img_src,
                },
            }),
        ),
        ...toCreate.map((qs) =>
            prisma.qs.create({
                data: { qsid: qs.id, ...qs, is_closed: qs.is_closed as boolean },
            }),
        ),
    ])

    await prisma.lastupdate.create({
        data: { type: 'QS' },
    })
    return NextResponse.json({ status: 'OK' })
}
