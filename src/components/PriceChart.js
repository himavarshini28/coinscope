import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchCoinChart } from '@/lib/api'
import { Button } from './Button'
import { formatPrice } from '@/lib/utils'

const TIME_RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
]

export function PriceChart({ coinId }) {
  const [chartData, setChartData] = useState([])
  const [selectedRange, setSelectedRange] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!coinId) return

    const loadChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Loading chart data for ${coinId} with ${selectedRange} days`);
        
        const data = await fetchCoinChart(coinId, selectedRange)
        
        if (!data || !data.prices || data.prices.length === 0) {
          throw new Error('No chart data available');
        }
        
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
          timestamp: timestamp,
        }))
        
        setChartData(formattedData)
      } catch (err) {
        console.error('Chart loading error:', err);
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [coinId, selectedRange])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-sm font-semibold">
            Price: {formatPrice(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Price Chart</h3>
          <div className="flex gap-2">
            {TIME_RANGES.map((range) => (
              <div key={range.days} className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Failed to load chart data</div>
          <div className="text-sm text-gray-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.days}
              variant={selectedRange === range.days ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedRange(range.days)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
