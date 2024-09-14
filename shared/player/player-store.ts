import { RefObject } from 'react'
import ReactPlayer from 'react-player'
import { create } from 'zustand'

export type TrackOpt = { index: number; name: string; language: string; groupId: string; kind: string }
export type AudioOpt = { index: number; name: string; language: string; groupId: string }
export type QualityOpt = { index: number; bitrate: number; resolution: string }

export type PlayerOptions = {
    url: string
    playing: boolean
    loop: boolean
    controls: boolean
    light: boolean
    volume: number
    muted: boolean
    width: string
    height: string
    progressInterval: number
    playbackRate: number
    playsinline: boolean
    pip: boolean
}

export type ExtraOptions = {
    player: RefObject<ReactPlayer> | null
    isFull: boolean
    languages: TrackOpt[]
    audios: AudioOpt[]
    qualities: QualityOpt[]
    playedRatio: number
    loadedRatio: number
    isCursorVisible: boolean
    playedSeconds: number
    loadedSeconds: number
}

export const defaultPlayerOptions: PlayerOptions = {
    url: '',
    playing: false,
    loop: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    width: '100%',
    height: '100%',
    progressInterval: 100,
    playbackRate: 1.0,
    playsinline: false,
    pip: false,
}

export const defaultExtraOptions: ExtraOptions = {
    player: null,
    isFull: false,
    languages: [],
    audios: [],
    qualities: [],
    playedRatio: 0,
    loadedRatio: 0,
    playedSeconds: 0,
    loadedSeconds: 0,
    isCursorVisible: true,
}

// eslint-disable-next-line no-unused-vars
export const usePlayerStore = create<{ playerOptions: PlayerOptions; setPlayerOptions: (options: Partial<PlayerOptions>) => void }>((set) => ({
    playerOptions: defaultPlayerOptions,
    setPlayerOptions: (options) =>
        set((state) => ({
            playerOptions: { ...state.playerOptions, ...options },
        })),
}))

// eslint-disable-next-line no-unused-vars
export const useExtraOptionsStore = create<{ extraOptions: ExtraOptions; setExtraOptions: (options: Partial<ExtraOptions>) => void }>((set) => ({
    extraOptions: defaultExtraOptions,
    setExtraOptions: (options) =>
        set((state) => ({
            extraOptions: {
                ...state.extraOptions,
                ...options,
            },
        })),
}))

export const resolutionMapper = (resolution: QualityOpt): { width: string; height: string } => {
    try {
        const [width, height] = resolution.resolution.split('x')
        return { width, height }
    } catch (error) {
        return { width: '0', height: '0' }
    }
}
