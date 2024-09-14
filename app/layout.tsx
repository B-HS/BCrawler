import { Toaster } from '@shared/ui/toaster'
import { cn } from '@shared/utils'
import { SiteHeader } from '@widgets/header'
import { QueryProvider, ThemeProvider } from '@widgets/provider'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import { FC, ReactNode } from 'react'
import './globals.css'

const GoToTop = dynamic(() => import('@features/common').then((comp) => comp.GoToTop), { ssr: false })

export const metadata: Metadata = {
    title: 'B-Hotdeal',
    description: 'HOT DEAL CRAWLING SITE',
}

const fontRound = M_PLUS_Rounded_1c({
    subsets: ['latin'],
    variable: '--font-mplus',
    weight: ['100', '300', '500', '700', '800', '900'],
})

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <html lang='ko' suppressHydrationWarning>
            <body className={cn('flex flex-col min-h-dvh font-mplus antialiased', fontRound.variable)}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <QueryProvider>
                        <SiteHeader />
                        <section className='max-w-screen-2xl mx-auto overflow-auto size-full flex-1'>
                            {children}
                            <GoToTop />
                        </section>
                    </QueryProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
