import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/util/date'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

const Home = async () => {
    const headersList = headers()
    const domain = headersList.get('x-forwarded-host')
    const origin = headersList.get('x-forwarded-proto')
    const currentURL = `${origin}://${domain}`
    const baseURL = {
        qs: 'https://quasarzone.com',
        fm: '',
    }

    const data = {
        qs: await fetch(currentURL + '/api/list?type=qs', { method: 'GET' }).then((res) => res.json()),
        fm: [],
    }

    return (
        <Tabs defaultValue='qs' className='w-full h-full flex flex-col'>
            <TabsList className='flex justify-start flex-wrap h-fit'>
                <TabsTrigger value={'qs'} className='capitalize min-w-[113px] w-[14.285%] '>
                    Qusar
                </TabsTrigger>
                <TabsTrigger value={'fm'} className='capitalize min-w-[113px] w-[14.285%] '>
                    FM
                </TabsTrigger>
            </TabsList>
            {Object.keys(data).map((deals) => (
                <TabsContent key={deals} value={deals} className='flex-1 cursor-pointer'>
                    <section
                        className='grid grid-flow-row-dense gap-4 h-full py-2.5 max-h-[485px]'
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}
                    >
                        {data[deals as 'qs' | 'fm'].map((deal: Article) => (
                            <Link
                                key={deal.id}
                                href={`${baseURL[deals as 'qs' | 'fm']}${deal.url}`}
                                className='flex justify-between flex-col border shadow-md hover:-translate-y-2 transition-transform'
                            >
                                <div className='relative flex-1 aspect-[225/317]'>
                                    <Image src={deal.img_src} alt={deal.title} fill style={{ objectFit: 'inherit' }} sizes='100%' priority />
                                </div>
                                <span className='text-center truncate'>{deal.title}</span>
                                <span className='text-center'>{deal.price}</span>
                                <span className='text-center'>{deal.shipping}</span>
                                <span className='text-center'>{formatDate(deal.date)}</span>
                                <span className='text-center'>{deal.category}</span>
                                <span className='text-center'>{deal.is_closed ? 'Closed' : 'Open'}</span>
                            </Link>
                        ))}
                    </section>
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default Home
