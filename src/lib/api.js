import { generateMockChartData } from './mockData';

// API Configuration
const BASE_URL = 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

// Helper function to build headers
function getHeaders() {
  const headers = {
    'Accept': 'application/json',
  }
  
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY
  }
  
  return headers
}

/**
 * Fetch coins market data with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Array>} Array of coin objects
 */
export async function fetchCoinsMarkets(page = 1, perPage = 50) {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
      {
        headers: getHeaders(),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching coins markets:', error)
    throw error
  }
}

/**
 * Fetch detailed information about a specific coin
 * @param {string} coinId - The coin ID (e.g., "bitcoin")
 * @returns {Promise<Object>} Detailed coin data
 */
export async function fetchCoinDetails(coinId) {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: getHeaders(),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching coin details:', error)
    throw error
  }
}

/**
 * Fetch price chart data for a coin
 * @param {string} coinId - The coin ID
 * @param {number} days - Number of days for chart data
 * @returns {Promise<Object>} Chart data with prices, market_caps, total_volumes
 */
export async function fetchCoinChart(coinId, days = 7) {
  try {
    console.log(`Fetching chart data for ${coinId} (${days} days)`);
    
    const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    console.log('Request URL:', url);
    
    const headers = getHeaders();
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Chart data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Fallback to mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock chart data as fallback');
      return generateMockChartData(days);
    }
    
    throw error;
  }
}

/**
 * Search for coins by name or symbol
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export async function searchCoins(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`,
      {
        headers: getHeaders(),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching coins:', error)
    throw error
  }
}
