import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine and merge Tailwind CSS classes
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with proper currency symbol
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  if (price < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    }).format(price)
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Format percentage with + or - sign
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return 'N/A'
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

/**
 * Format large numbers (market cap, volume)
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(0)}`
}

/**
 * Get color class for percentage changes
 * @param {number} percentage - Percentage change value
 * @returns {string} CSS class name
 */
export function getPercentageColor(percentage) {
  if (percentage > 0) return "text-green-600"
  if (percentage < 0) return "text-red-600"
  return "text-gray-600"
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Filter coins based on search query
 * @param {Array} coins - Array of coin objects
 * @param {string} query - Search query
 * @returns {Array} Filtered coins
 */
export function filterCoins(coins, query) {
  if (!query) return coins
  
  const lowercaseQuery = query.toLowerCase()
  return coins.filter(coin => 
    coin.name.toLowerCase().includes(lowercaseQuery) ||
    coin.symbol.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Sort coins by different criteria
 * @param {Array} coins - Array of coin objects
 * @param {string} sortBy - Sort criteria
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array} Sorted coins
 */
export function sortCoins(coins, sortBy, order = 'desc') {
  return [...coins].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}
