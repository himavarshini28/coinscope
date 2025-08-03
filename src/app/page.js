'use client'

import { useState, useEffect } from 'react'
import { fetchCoinsMarkets } from '@/lib/api'
import { filterCoins, sortCoins } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { MarketsTable } from '@/components/MarketsTable'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { Button } from '@/components/Button'

export default function Home() {
  const [coins, setCoins] = useState([])
  const [filteredCoins, setFilteredCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('market_cap_rank')
  const [sortOrder, setSortOrder] = useState('asc')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch coins data
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCoinsMarkets(currentPage, 50)
        setCoins(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCoins()
  }, [currentPage])

  // Filter and sort coins when search or sort changes
  useEffect(() => {
    let filtered = filterCoins(coins, debouncedSearchQuery)
    filtered = sortCoins(filtered, sortBy, sortOrder)
    setFilteredCoins(filtered)
  }, [coins, debouncedSearchQuery, sortBy, sortOrder])

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-xl mb-4">Failed to load cryptocurrency data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cryptocurrency Markets
        </h1>
        <p className="text-gray-600">
          Live prices and market data for top cryptocurrencies
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {/* Markets Table */}
      <MarketsTable coins={filteredCoins} loading={loading} />

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={filteredCoins.length < 50}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
