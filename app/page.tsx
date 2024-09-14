'use client'
import { Article } from '@entities/common'
import { Button } from '@shared/ui/button'
import Fallback from '@shared/ui/fall-back'
import { formatDate } from '@shared/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Bird } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const fetchList = async ({
    pageParam,
}: {
    pageParam: {
        page: number
        type: 'qs' | 'pm'
    }
}) => {
    console.log(pageParam)

    const res = await fetch(`/api/list?type=${pageParam.type}&page=${pageParam.page}`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    pageParam
    return res.json()
}

const Page = () => {
    const [currentTab, setCurrentTab] = useState<'qs' | 'pm'>('qs')
    const observeRef = useRef<HTMLDivElement>(null)

    const baseURL = {
        qs: 'https://quasarzone.com',
        pm: 'https://ppomppu.co.kr/zboard',
    }

    const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
        queryKey: ['list', currentTab],
        queryFn: fetchList,
        initialPageParam: { page: 1, type: currentTab },
        getNextPageParam: (data) => ({ page: data.currentPage + 1, type: currentTab }),
    })

    const loadMore = useCallback(() => {
        if (hasNextPage) fetchNextPage()
    }, [hasNextPage, fetchNextPage])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            { threshold: 0.5 },
        )

        if (observeRef.current) {
            observer.observe(observeRef.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [loadMore])

    return (
        <section className='flex flex-col gap-1 flex-1 p-5'>
            <section className='flex gap-2 items-center w-full bg-secondary rounded-lg p-2'>
                <Button className='w-1/2' variant={currentTab === 'qs' ? 'default' : 'secondary'} onClick={() => setCurrentTab('qs')}>
                    Quasar
                </Button>
                <Button className='w-1/2' variant={currentTab === 'pm' ? 'default' : 'secondary'} onClick={() => setCurrentTab('pm')}>
                    Ppom
                </Button>
            </section>
            <section
                className='grid grid-flow-row-dense gap-4 h-full py-2.5'
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {data?.pages.map((page, pageIndex) =>
                    page.items.map((deal: Article, dealIndex: number) => (
                        <Link
                            key={`${pageIndex}-${dealIndex}-${deal.id}`}
                            href={`${baseURL[currentTab]}${deal.url || ''}`}
                            className='flex justify-between flex-col bord∏er shadow-md hover:-translate-y-2 transition-transform rounded'>
                            <div className='relative flex-1 aspect-[225/317]'>
                                {deal.img_src !== 'https:' ? (
                                    <Image
                                        src={deal.img_src || '/favicon.ico'}
                                        alt={deal.title}
                                        fill
                                        style={{ objectFit: 'inherit', filter: `invert(${deal.img_src ? 0 : 1})` }}
                                        sizes='100%'
                                        priority
                                    />
                                ) : (
                                    <Bird className='size-full p-10' />
                                )}
                            </div>

                            <span className='text-center truncate'>{deal.title}</span>
                            <span className='text-center'>{deal.price}</span>
                            <span className='text-center'>{deal.shipping}</span>
                            <span className='text-center'>{formatDate(deal.date)}</span>
                            <span className='text-center'>{deal.category}</span>
                            <span className='text-center'>{deal.is_closed ? 'Closed' : 'Open'}</span>
                        </Link>
                    )),
                )}
                <div ref={observeRef} className='h-10' />
            </section>
            {status !== 'success' && <Fallback />}
        </section>
    )
}

export default Page
