import dynamic from 'next/dynamic'
import Github from '../icons/github'
import Refresh from '../icons/refresh'

const ThemeChanger = dynamic(() => import('../theme/theme-changer'), { ssr: false })

const Navigation = () => {
    return (
        <nav className='flex items-center'>
            <Refresh />
            <Github noTooltip />
            <ThemeChanger />
        </nav>
    )
}

export default Navigation
