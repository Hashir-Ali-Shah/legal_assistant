import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TokenUsageChart({ data }) {
  // Transform daily data for chart
  const chartData = data.daily.map(item => ({
    date: new Date(typeof item.date === 'string' ? item.date.replace(' ', 'T') : item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tokens: item.tokens,
    cost: item.cost,
    requests: item.requests,
  })).reverse(); // Reverse to show oldest to newest

  // Transform model data for bar chart
  const modelData = Object.entries(data.by_model).map(([model, stats]) => ({
    name: model.split('/').pop(), // Get model name without provider
    tokens: stats.tokens,
    cost: stats.cost,
    requests: stats.requests,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Tokens</p>
          <p className="text-white text-2xl font-bold mt-1">
            {data.total_tokens.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-white text-2xl font-bold mt-1">
            ${data.total_cost_usd.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Requests</p>
          <p className="text-white text-2xl font-bold mt-1">
            {data.total_requests.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-white text-2xl font-bold mt-1">
            {data.total_users}
          </p>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Daily Token Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Line type="monotone" dataKey="tokens" stroke="#3B82F6" strokeWidth={2} name="Tokens" />
            <Line type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={2} name="Requests" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Breakdown */}
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Usage by Model</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar dataKey="tokens" fill="#8B5CF6" name="Tokens" />
            <Bar dataKey="cost" fill="#EC4899" name="Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
