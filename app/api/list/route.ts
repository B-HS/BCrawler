import { NextRequest, NextResponse } from 'next/server'
import prisma from 'prisma/db'
export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {
    const page = Number(req.nextUrl.searchParams.get('page') || '1')
    const type = req.nextUrl.searchParams.get('type')
    const search = req.nextUrl.searchParams.get('search')

    if (!type) return NextResponse.json({ status: 'type is required' }, { status: 400 })

    console.log('123124',search)

    const modelMap: Record<string, any> = {
        qs: prisma.qs,
        pm: prisma.pm,
    }
    const model = modelMap[type]

    if (!model) NextResponse.json({ status: 'invalid type' }, { status: 400 })

    const list = await modelMap[type].findMany({
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        ...(search
            ? {
                  where: {
                      title: {
                          contains: search,
                      },
                  },
              }
            : {}),
        take: 20,
        skip: (page - 1) * 20,
    })

    const totalItems = await model.count({
        where: {
            title: `%${search}%`,
        },
    })

    return NextResponse.json({
        items: list,
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / 20),
        isNext: totalItems > page * 20,
    })
}
