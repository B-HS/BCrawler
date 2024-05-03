'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import dayjs from 'dayjs'

const Refresh = ({
    variant,
    noTooltip,
}: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    noTooltip?: boolean
}) => {
    const [visible, setVisible] = useState('')
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

    useEffect(() => {
        fetch('/api/last', { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setVisible(data.txt)
            })
    }, [])

    return noTooltip ? (
        <Icon disabled={visible !== 'OK'} className={isLoading ? 'animate-spin' : 'animate-none'} variant={variant} onClick={listRefresh} />
    ) : (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className='leading-normal'>
                    <Icon
                        disabled={visible !== 'OK'}
                        className={isLoading ? 'animate-spin' : 'animate-none'}
                        variant={variant}
                        onClick={() => visible === 'OK' && listRefresh()}
                    />
                </TooltipTrigger>
                <TooltipContent>{visible === 'OK' ? '갱신 가능' : dayjs(visible).format('마지막 갱신일 YYYY. MM. DD HH:mm:ss')}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const Icon = ({
    variant,
    className,
    onClick,
    disabled,
}: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    className: string
    onClick: () => void
    disabled: boolean
}) => {
    return (
        <Button
            disabled={disabled}
            className='disabled:cursor-not-allowed'
            variant={variant || 'ghost'}
            size={'icon'}
            asChild
            aria-label='Github'
            onClick={() => !disabled && onClick()}
        >
            <span className='p-2 disabled:cursor-not-allowed'>
                <RefreshCcw className={cn('size-6', className)} />
            </span>
        </Button>
    )
}

export default Refresh
