'use client'
import { RefreshCcw, RefreshCwOff } from 'lucide-react'

const RefreshList = ({ type, refreshAllow }: { type: 'qs' | 'fm'; refreshAllow: boolean }) => {
    return refreshAllow ? <RefreshCcw /> : <RefreshCwOff />
}

export default RefreshList
