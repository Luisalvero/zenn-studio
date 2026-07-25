import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { groupTracks, type SoundPlaylist } from '@/data/sound'
import { fetchTracks } from './sound-api'

interface SoundValue {
  playlists: SoundPlaylist[]
  loading: boolean
  reload: () => Promise<void>
}

const SoundContext = createContext<SoundValue>({
  playlists: [],
  loading: true,
  reload: async () => {},
})

export function SoundProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<SoundPlaylist[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true)
    try {
      const rows = await fetchTracks()
      setPlaylists(groupTracks(rows))
    } catch {
      setPlaylists([])
    }
    setLoading(false)
  }

  useEffect(() => {
    void reload()
  }, [])

  return <SoundContext.Provider value={{ playlists, loading, reload }}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
