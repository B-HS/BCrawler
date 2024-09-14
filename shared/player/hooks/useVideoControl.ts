import { useEffect } from 'react'
import screenfull from 'screenfull'
import { useExtraOptionsStore, usePlayerStore } from '../player-store'

export const useVideoControl = () => {
    const { extraOptions, setExtraOptions } = useExtraOptionsStore()
    const { playerOptions, setPlayerOptions } = usePlayerStore()
    const player = extraOptions.player?.current

    const playToggle = (value?: boolean) => {
        if (value !== undefined) {
            setPlayerOptions({ playing: value })
            return
        }
        setPlayerOptions({ playing: !playerOptions.playing })
    }

    const playSeekTo = (fraction: number) => {
        const currentTime = extraOptions.player?.current?.getCurrentTime()
        if (currentTime !== undefined) {
            extraOptions.player?.current?.seekTo(fraction / 100, 'fraction')
        }
    }

    const playSeekToBySeconds = (seconds: number) => {
        const currentTime = extraOptions.player?.current?.getCurrentTime() || 0
        extraOptions.player?.current?.seekTo(currentTime + seconds)
    }

    const muteToggle = () => {
        setPlayerOptions({ muted: !playerOptions.muted })
    }

    const playRateChange = (rate: number) => {
        setPlayerOptions({ playbackRate: rate })
    }

    const pipModeToggle = () => {
        setPlayerOptions({ pip: !playerOptions.pip })
    }

    const fullscreenToggle = () => {
        if (screenfull.isFullscreen) {
            setExtraOptions({ isFull: false })
            screenfull.exit()
        } else {
            setExtraOptions({ isFull: false })
            screenfull.request(document.querySelector('.video-player')!)
        }
    }

    const currentQuality = () => player?.getInternalPlayer('hls').currentLevel

    const currentAudioTrack = () => player?.getInternalPlayer('hls').audioTrackController.audioTrack

    const currentSubtitle = () =>
        Array.from(player?.getInternalPlayer()!.textTracks || []).find((track: any) => track.mode === 'showing') as {
            label: string
            language: string
            kind: string
        }

    const setSubtitle = (index: number) => {
        const video = player?.getInternalPlayer() as HTMLVideoElement
        Array.from(video.textTracks).forEach((track: any) => {
            track.mode = 'disabled'
        })
        video.textTracks[index].mode = 'showing'
    }

    const setAudioTrack = (index: number) => {
        player && (player.getInternalPlayer('hls').audioTrackController.audioTrack = index)
    }

    const setQuality = (index: number) => {
        player && (player.getInternalPlayer('hls').currentLevel = index)
    }

    useEffect(() => {
        if (player && extraOptions.loadedSeconds > 0) {
            const videoElement = player.getInternalPlayer('hls')
            setExtraOptions({
                qualities: videoElement.levels.map(
                    (
                        level: {
                            bitrate: number
                            width: number
                            height: number
                        },
                        index: number,
                    ) => ({
                        index: index,
                        bitrate: level.bitrate,
                        resolution: `${level.width}x${level.height}`,
                    }),
                ),
                audios: videoElement.audioTracks.map(
                    (
                        track: {
                            name: string
                            lang?: string
                            groupId: string
                        },
                        index: number,
                    ) => ({
                        index: index,
                        name: track.name,
                        language: track.lang || '',
                        groupId: track.groupId,
                    }),
                ),
                languages: videoElement.subtitleTracks.map(
                    (
                        track: {
                            name: string
                            lang: string
                            groupId: string
                            kind: string
                        },
                        index: number,
                    ) => ({
                        index: index,
                        name: track.name,
                        language: track.lang,
                        groupId: track.groupId,
                        kind: track.kind,
                    }),
                ),
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extraOptions.loadedSeconds])

    return {
        playToggle,
        playSeekTo,
        playSeekToBySeconds,
        muteToggle,
        playRateChange,
        pipModeToggle,
        fullscreenToggle,
        currentQuality,
        currentAudioTrack,
        currentSubtitle,
        setSubtitle,
        setAudioTrack,
        setQuality,
    }
}
