/**
 * Mock data for development when API is unavailable
 */

export function generateMockChartData(days = 7) {
  const data = [];
  const now = Date.now();
  const interval = days === 1 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour for 24h, 1 day for others
  const points = days === 1 ? 24 : days;
  
  // Generate base price (random between $1000-$50000)
  const basePrice = Math.random() * 49000 + 1000;
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * interval;
    // Add some realistic price variation (±5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const price = basePrice * (1 + variation);
    
    data.push([timestamp, price]);
  }
  
  return {
    prices: data,
    market_caps: data.map(([timestamp, price]) => [timestamp, price * 19000000]),
    total_volumes: data.map(([timestamp, price]) => [timestamp, price * 1000000])
  };
}

export const mockCoinData = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
  current_price: 45000,
  market_cap: 850000000000,
  market_cap_rank: 1,
  fully_diluted_valuation: 945000000000,
  total_volume: 25000000000,
  high_24h: 46000,
  low_24h: 44000,
  price_change_24h: 1000,
  price_change_percentage_24h: 2.27,
  market_cap_change_24h: 19000000000,
  market_cap_change_percentage_24h: 2.28,
  circulating_supply: 19000000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69000,
  ath_change_percentage: -34.78,
  ath_date: "2021-11-10T14:24:11.849Z",
  atl: 67.81,
  atl_change_percentage: 66300.77,
  atl_date: "2013-07-06T00:00:00.000Z",
  last_updated: new Date().toISOString()
};
