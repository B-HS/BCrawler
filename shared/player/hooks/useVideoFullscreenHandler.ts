import { useEffect } from 'react'
import { useExtraOptionsStore } from '../player-store'

export const useVideoFullScreenHandler = () => {
    const { extraOptions, setExtraOptions } = useExtraOptionsStore()
    useEffect(() => {
        // eslint-disable-next-line
        let timeout: string | number | NodeJS.Timeout | undefined

        const handleMouseMove = () => {
            setExtraOptions({ isCursorVisible: true })
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setExtraOptions({ isCursorVisible: false })
            }, 1500)
        }

        if (extraOptions.isFull) {
            setExtraOptions({ isCursorVisible: true })
            window.addEventListener('mousemove', handleMouseMove)
        } else {
            setExtraOptions({ isCursorVisible: true })
            window.removeEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearTimeout(timeout)
        }
    }, [extraOptions.isFull, setExtraOptions])
}
