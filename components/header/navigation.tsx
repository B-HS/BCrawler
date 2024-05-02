import dynamic from 'next/dynamic'
import Github from '../icons/github'

const ThemeChanger = dynamic(() => import('../theme/theme-changer'), { ssr: false })

const Navigation = () => {
    return (
        <nav className='flex items-center'>
            <ThemeChanger />
            <Github noTooltip />
        </nav>
    )
}

export default Navigation
