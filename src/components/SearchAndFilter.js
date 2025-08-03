import { Input } from './Input'
import { Button } from './Button'

export function SearchAndFilter({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSortChange,
  onSortOrderChange 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="market_cap_rank">Rank</option>
          <option value="current_price">Price</option>
          <option value="price_change_percentage_24h">24h Change</option>
          <option value="market_cap">Market Cap</option>
          <option value="total_volume">Volume</option>
        </select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>
    </div>
  )
}
