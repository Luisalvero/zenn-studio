import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { embedUrl, type VideoProvider } from '@/lib/video'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

interface VideoModalProps {
  open: boolean
  onClose: () => void
  provider: VideoProvider
  id: string
  title?: string
}

/**
 * Full-screen video overlay for the showreel. Fades in over a dark backdrop,
 * autoplays the embed, closes on Escape / backdrop click, locks body scroll,
 * and moves focus to the close button for keyboard users.
 */
export function VideoModal({ open, onClose, provider, id, title = 'Showreel' }: VideoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const hasVideo = id.trim().length > 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} video`}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close video"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone transition-colors duration-300 hover:bg-white/10 focus-visible:outline-2 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            className="w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60">
              {hasVideo ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl(provider, id, true)}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-mist">
                  <p className="text-lg text-bone">Showreel coming soon</p>
                  <p className="max-w-sm text-sm text-ash">
                    Add your video ID in <code className="text-mist">src/config/site.ts</code> to embed it here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
