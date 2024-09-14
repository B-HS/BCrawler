'use client'

import { useRef } from 'react'

export const ClientsidePosts = () => {
    const observeRef = useRef<HTMLDivElement>(null)
    return (
        <section ref={observeRef} className='bg-green-300 h-20'>
            Observer
        </section>
    )
}
