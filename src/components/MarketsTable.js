import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatPercentage, formatNumber, getPercentageColor } from '@/lib/utils'
import { WatchlistButton } from './WatchlistButton'

export function MarketsTable({ coins, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Coin</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">24h %</div>
          <div className="col-span-2 text-right">Market Cap</div>
          <div className="col-span-2 text-right">Volume (24h)</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {coins.map((coin) => (
          <Link
            key={coin.id}
            href={`/coin/${coin.id}`}
            className="block px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Rank */}
              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{coin.market_cap_rank}</span>
                  <WatchlistButton coinId={coin.id} />
                </div>
              </div>

              {/* Coin Info */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <Image 
                    src={coin.image} 
                    alt={coin.name} 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{coin.name}</div>
                    <div className="text-sm text-gray-500 uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-right">
                <div className="font-semibold text-gray-900">
                  {formatPrice(coin.current_price)}
                </div>
              </div>

              {/* 24h Change */}
              <div className="col-span-2 text-right">
                <div className={`font-medium ${getPercentageColor(coin.price_change_percentage_24h)}`}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </div>
              </div>

              {/* Market Cap */}
              <div className="col-span-2 text-right">
                <div className="text-gray-900">
                  {formatNumber(coin.market_cap)}
                </div>
              </div>

              {/* Volume */}
              <div className="col-span-2 text-right">
                <div className="text-gray-900">
                  {formatNumber(coin.total_volume)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {coins.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-500">No cryptocurrencies found</div>
        </div>
      )}
    </div>
  )
}
