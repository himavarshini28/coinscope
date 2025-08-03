'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchCoinDetails } from '@/lib/api'
import { formatPrice, formatPercentage, formatNumber, getPercentageColor } from '@/lib/utils'
import { PriceChart } from '@/components/PriceChart'
import { WatchlistButton } from '@/components/WatchlistButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'

export default function CoinDetailPage() {
  const params = useParams()
  const coinId = params.id
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!coinId) return

    const loadCoinDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCoinDetails(coinId)
        setCoin(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCoinDetails()
  }, [coinId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-xl mb-4">Failed to load coin details</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Link href="/">
            <Button>Back to Markets</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!coin || !coin.market_data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-600">Coin not found</div>
          <Link href="/">
            <Button>Back to Markets</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">← Back to Markets</Button>
        </Link>
      </div>

      {/* Coin Header */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={coin.image?.large || coin.image?.small || '/placeholder.png'}
          alt={coin.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
            <span className="text-lg text-gray-500 uppercase">{coin.symbol}</span>
            <WatchlistButton coinId={coin.id} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-500">
              Rank #{coin.market_cap_rank || 'N/A'}
            </span>
            {coin.categories && coin.categories.length > 0 && (
              <span className="text-sm text-gray-500">
                {coin.categories[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price and Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(coin.market_data.current_price?.usd || 0)}
            </div>
            <div className={`text-sm ${getPercentageColor(coin.market_data.price_change_percentage_24h)}`}>
              {formatPercentage(coin.market_data.price_change_percentage_24h)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(coin.market_data.market_cap?.usd || 0)}
            </div>
            <div className={`text-sm ${getPercentageColor(coin.market_data.market_cap_change_percentage_24h)}`}>
              {formatPercentage(coin.market_data.market_cap_change_percentage_24h)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(coin.market_data.total_volume?.usd || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coin.market_data.circulating_supply ? 
                `${(coin.market_data.circulating_supply / 1e6).toFixed(2)}M` : 
                'N/A'
              }
            </div>
            {coin.market_data.max_supply && (
              <div className="text-sm text-gray-500">
                Max: {(coin.market_data.max_supply / 1e6).toFixed(2)}M
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <div className="mb-8">
        <PriceChart coinId={coin.id} />
      </div>

      {/* Additional Info */}
      {coin.description?.en && (
        <Card>
          <CardHeader>
            <CardTitle>About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-gray-700 prose max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: coin.description.en.split('.')[0] + '.' 
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
