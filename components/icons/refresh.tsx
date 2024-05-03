'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

const Refresh = ({
    variant,
    noTooltip,
}: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    noTooltip?: boolean
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const listRefresh = () => {
        setIsLoading(true)
        Promise.all([
            fetch('/api/refresh/qs', { method: 'POST' }),
            fetch('/api/refresh/fm', { method: 'POST' }),
            fetch('/api/refresh/pm', { method: 'POST' }),
        ]).finally(() => {
            setIsLoading(false)
            window.location.reload()
        })
    }

    return noTooltip ? (
        <Icon className={isLoading ? 'animate-spin' : 'animate-none'} variant={variant} onClick={listRefresh} />
    ) : (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className='leading-normal'>
                    <Icon className={isLoading ? 'animate-spin' : 'animate-none'} variant={variant} onClick={listRefresh} />
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const Icon = ({
    variant,
    className,
    onClick,
}: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    className: string
    onClick: () => void
}) => {
    return (
        <Button variant={variant || 'ghost'} size={'icon'} asChild aria-label='Github' onClick={onClick}>
            <span className='p-2'>
                <RefreshCcw className={cn('size-6', className)} />
            </span>
        </Button>
    )
}

export default Refresh
