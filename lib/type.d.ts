type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

interface ScheduleData {
    tz: string
    schedule: Record<DayOfWeek, Show[]>
}

interface DownloadProps {
    res: number
    torrent: string
    magnet: string
    xdcc: string
}

interface EpisodeProps {
    time: string
    release_date: string
    show: string
    episode: string
    downloads: DownloadDownloadProps[]
}

interface Detail {
    batch: any
    episode: Record<string, EpisodeProps>
}

interface Show {
    title: string
    page: string
    image_url: string
    time: string
}
