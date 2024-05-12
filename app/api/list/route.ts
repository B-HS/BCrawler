import prisma from '@/prisma/db'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {
    const page = Number(req.nextUrl.searchParams.get('page') || '1')
    const type = req.nextUrl.searchParams.get('type')

    if (!type) return NextResponse.json({ status: 'type is required' }, { status: 400 })

    const modelMap: Record<string, any> = {
        qs: prisma.qs,
        pm: prisma.pm,
    }
    const model = modelMap[type]
    if (!model) NextResponse.json({ status: 'invalid type' }, { status: 400 })

    const list = await model.findMany({
        take: 20,
        skip: (page - 1) * 20,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    })

    return NextResponse.json(list)
}
