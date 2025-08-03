import { useWatchlist } from '@/hooks/useWatchlist'

export function WatchlistButton({ coinId, className }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const isWatched = isInWatchlist(coinId)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleWatchlist(coinId)
      }}
      className={`p-1 rounded hover:bg-gray-100 transition-colors ${className}`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isWatched ? (
        <span className="text-yellow-500">★</span>
      ) : (
        <span className="text-gray-400">☆</span>
      )}
    </button>
  )
}
