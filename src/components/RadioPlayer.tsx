import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Radio, Maximize2, Minimize2 } from 'lucide-react'

interface RadioPlayerProps {
  streamUrl: string
  title?: string
  className?: string
  compact?: boolean
}

export function RadioPlayer({ streamUrl, title = "Father's Home Radio", className = "", compact = false }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Проверяем, является ли URL YouTube-ссылкой
  const isYouTubeUrl = streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be')
  
  // Извлекаем ID видео из YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = isYouTubeUrl ? getYouTubeVideoId(streamUrl) : null
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0&enablejsapi=1` : null
  
  console.log('RadioPlayer debug:', {
    streamUrl,
    isYouTubeUrl,
    videoId,
    embedUrl
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }
    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }
    const handleError = () => {
      setIsLoading(false)
      setIsPlaying(false)
      setError('Ошибка загрузки аудио')
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    console.log('Toggle play clicked, isYouTubeUrl:', isYouTubeUrl, 'streamUrl:', streamUrl)
    if (isYouTubeUrl) {
      // Для YouTube всегда открываем полноценный плеер
      console.log('Opening YouTube player, embedUrl:', embedUrl)
      
      // Попробуем открыть в новом окне как fallback
      if (embedUrl) {
        window.open(embedUrl, '_blank', 'width=800,height=600')
      } else {
        // Если embedUrl не работает, откроем оригинальную ссылку
        window.open(streamUrl, '_blank')
      }
      
      setIsExpanded(true)
      setIsMinimized(false)
      setIsPlaying(true)
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch((err) => {
        console.error('Ошибка воспроизведения:', err)
        setError('Ошибка воспроизведения')
      })
      setIsPlaying(true)
    }
  }

  const minimizePlayer = () => {
    setIsMinimized(true)
    setIsExpanded(false)
  }

  const restorePlayer = () => {
    setIsMinimized(false)
    setIsExpanded(true)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    setVolume(newVolume)
    if (!isMuted) {
      audio.volume = newVolume
    }
  }

  // Компактная версия для боковой панели
  if (compact) {
    return (
      <div className={`bg-card border border-border rounded-lg ${className}`}>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Radio className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-foreground truncate">
                {title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isYouTubeUrl ? 'YouTube' : 'Audio'}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Compact play button clicked!')
                if (isYouTubeUrl) {
                  window.open(streamUrl, '_blank')
                } else {
                  togglePlay()
                }
              }}
              className="p-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              disabled={isLoading}
              title={isYouTubeUrl ? 'Открыть плеер' : (isPlaying ? 'Пауза' : 'Воспроизвести')}
            >
              {isLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : isYouTubeUrl ? (
                <Play className="h-3 w-3" />
              ) : isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 text-xs text-destructive">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Compact View */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Radio className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {error ? error : isYouTubeUrl ? 'YouTube - нажмите для воспроизведения' : (isPlaying ? 'В эфире' : 'Остановлено')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Play/Expand Button */}
              <button
                onClick={togglePlay}
                disabled={isLoading && !isYouTubeUrl}
                className="p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50"
                title={isYouTubeUrl ? 'Открыть плеер' : (isPlaying ? 'Пауза' : 'Воспроизвести')}
              >
                {isLoading && !isYouTubeUrl ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isYouTubeUrl ? (
                  <Maximize2 className="h-4 w-4" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>

              {/* Volume Control - только для не-YouTube */}
              {!isYouTubeUrl && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMute}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expanded YouTube Player - Modal */}
      {isExpanded && isYouTubeUrl && embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-card border border-border rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">{title}</h3>
              <button
                onClick={minimizePlayer}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                title="Свернуть плеер (музыка продолжит играть)"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                className="absolute inset-0 w-full h-full rounded-b-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element - только для не-YouTube */}
      {!isYouTubeUrl && (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="none"
          crossOrigin="anonymous"
        />
      )}

      {/* Minimized Player - показывается внизу экрана */}
      {isMinimized && isYouTubeUrl && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Radio className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {title}
              </h4>
              <p className="text-xs text-muted-foreground">
                Воспроизводится в фоне
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={restorePlayer}
                className="p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                title="Развернуть плеер"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => {
                  setIsMinimized(false)
                  setIsExpanded(false)
                  // Останавливаем воспроизведение YouTube
                  if (iframeRef.current) {
                    iframeRef.current.src = iframeRef.current.src.replace('autoplay=1', 'autoplay=0')
                  }
                }}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                title="Остановить"
              >
                <Pause className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
