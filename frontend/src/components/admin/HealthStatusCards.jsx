export default function HealthStatusCards({ health }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'from-green-500 to-emerald-500';
      case 'degraded':
        return 'from-yellow-500 to-orange-500';
      case 'down':
        return 'from-red-500 to-red-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getConnectedColor = (connected) =>
    connected ? 'text-green-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Status */}
      <div className={`p-6 rounded-xl bg-gradient-to-br ${getStatusColor(health.status)} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">System Status</p>
            <p className="text-white text-3xl font-bold mt-2 capitalize">
              {health.status}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Database</p>
            <p className={`text-2xl font-bold mt-2 ${getConnectedColor(health.database.connected)}`}>
              {health.database.connected ? 'Connected' : 'Down'}
            </p>
            {health.database.connected && (
              <p className="text-gray-500 text-sm mt-1">
                {health.database.latency_ms}ms latency
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Redis */}
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Redis Cache</p>
            <p className={`text-2xl font-bold mt-2 ${getConnectedColor(health.redis.connected)}`}>
              {health.redis.connected ? 'Connected' : 'Disconnected'}
            </p>
            {!health.redis.connected && (
              <p className="text-gray-500 text-sm mt-1">Using fallback</p>
            )}
          </div>
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Error Rate (1h)</p>
            <p className={`text-2xl font-bold mt-2 ${
              health.metrics_1h.error_rate > 10 ? 'text-red-400' : 
              health.metrics_1h.error_rate > 5 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {health.metrics_1h.error_rate}%
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {health.metrics_1h.total_requests} requests
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
