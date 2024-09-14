import { NextResponse } from 'next/server'
import prisma from 'prisma/db'
export const dynamic = 'force-dynamic'

export const GET = async () => {
    const latestRecord = await prisma.lastupdate.findFirst({
        orderBy: { lastupdate: 'desc' },
    })
    const isAbleToUpdate = !latestRecord || Date.now() - latestRecord.lastupdate.getTime() > 3600000 / 2
    if (!isAbleToUpdate) return NextResponse.json({ txt: `Last update: ${latestRecord.lastupdate}` })

    return NextResponse.json({ txt: 'OK' })
}
