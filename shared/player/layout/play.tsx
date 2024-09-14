import { Button } from '@shared/ui/button'
import { cn } from '@shared/utils'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { ClassNameValue } from 'tailwind-merge'
import { usePlayerStore } from '../player-store'

export const Play = ({ className }: { className?: ClassNameValue }) => {
    const { playerOptions, setPlayerOptions } = usePlayerStore()

    return (
        <Button
            size={'icon'}
            variant={'ghost'}
            className={cn('rounded-none', className)}
            onClick={() => setPlayerOptions({ playing: !playerOptions.playing })}>
            {playerOptions.playing ? <PauseIcon /> : <PlayIcon />}
        </Button>
    )
}
