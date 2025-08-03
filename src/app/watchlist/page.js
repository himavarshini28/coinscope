'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchCoinsMarkets } from '@/lib/api'
import { useWatchlist } from '@/hooks/useWatchlist'
import { MarketsTable } from '@/components/MarketsTable'
import { Card, CardContent } from '@/components/Card'

export default function WatchlistPage() {
  const { watchlist } = useWatchlist()
  const [watchlistCoins, setWatchlistCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadWatchlistCoins = async () => {
      if (watchlist.length === 0) {
        setWatchlistCoins([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch current market data for all watchlist coins
        // We'll fetch multiple pages to get all coins and filter by watchlist
        const allCoins = []
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 10) { // Limit to 10 pages to avoid infinite loop
          const coins = await fetchCoinsMarkets(page, 250)
          allCoins.push(...coins)
          
          // Check if we have all watchlist coins
          const foundWatchlistCoins = allCoins.filter(coin => watchlist.includes(coin.id))
          if (foundWatchlistCoins.length === watchlist.length) {
            hasMore = false
          } else if (coins.length < 250) {
            hasMore = false
          } else {
            page++
          }
        }
        
        // Filter coins that are in the watchlist
        const filteredCoins = allCoins.filter(coin => watchlist.includes(coin.id))
        
        // Sort by watchlist order
        const sortedCoins = watchlist
          .map(id => filteredCoins.find(coin => coin.id === id))
          .filter(Boolean)
        
        setWatchlistCoins(sortedCoins)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlistCoins()
  }, [watchlist])

  if (watchlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
          <p className="text-gray-600">Keep track of your favorite cryptocurrencies</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding cryptocurrencies to track their prices and performance
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
              >
                Browse Markets
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
          <p className="text-gray-600">Keep track of your favorite cryptocurrencies</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">Failed to load watchlist</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
        <p className="text-gray-600">
          {watchlist.length} {watchlist.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'} in your watchlist
        </p>
      </div>

      <MarketsTable coins={watchlistCoins} loading={loading} />
    </div>
  )
}
