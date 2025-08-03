import { useState, useEffect } from 'react'

/**
 * Watchlist hook for managing favorite coins
 * @returns {Object} Watchlist state and methods
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([])

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('coinscope_watchlist')
      if (saved) {
        setWatchlist(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('coinscope_watchlist', JSON.stringify(watchlist))
    } catch (error) {
      console.error('Error saving watchlist:', error)
    }
  }, [watchlist])

  const addToWatchlist = (coinId) => {
    setWatchlist(prev => [...new Set([...prev, coinId])])
  }

  const removeFromWatchlist = (coinId) => {
    setWatchlist(prev => prev.filter(id => id !== coinId))
  }

  const toggleWatchlist = (coinId) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId)
    } else {
      addToWatchlist(coinId)
    }
  }

  const isInWatchlist = (coinId) => {
    return watchlist.includes(coinId)
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  }
}
