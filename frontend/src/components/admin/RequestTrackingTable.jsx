import { useState } from 'react';

export default function RequestTrackingTable({ requests, onRefresh }) {
  const [filter, setFilter] = useState({ endpoint: '', status: '' });

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResponseTimeColor = (ms) => {
    if (ms < 200) return 'text-green-400';
    if (ms < 1000) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredRequests = requests.filter(req => {
    if (filter.endpoint && !req.endpoint.toLowerCase().includes(filter.endpoint.toLowerCase())) {
      return false;
    }
    if (filter.status && req.status_code.toString() !== filter.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Request Tracking</h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by endpoint..."
          value={filter.endpoint}
          onChange={(e) => setFilter({ ...filter, endpoint: e.target.value })}
          className="px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 outline-none"
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 outline-none"
        >
          <option value="">All Status Codes</option>
          <option value="200">200 OK</option>
          <option value="400">400 Bad Request</option>
          <option value="401">401 Unauthorized</option>
          <option value="404">404 Not Found</option>
          <option value="500">500 Internal Error</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Time</th>
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Endpoint</th>
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Method</th>
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Response Time</th>
              <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {new Date(typeof req.timestamp === 'string' ? req.timestamp.replace(' ', 'T') : req.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm font-mono max-w-xs truncate" title={req.endpoint}>
                  {req.endpoint}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    req.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    req.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                    req.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                    req.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {req.method}
                  </span>
                </td>
                <td className={`py-3 px-4 font-medium ${getStatusColor(req.status_code)}`}>
                  {req.status_code}
                </td>
                <td className={`py-3 px-4 font-medium ${getResponseTimeColor(req.response_time_ms)}`}>
                  {req.response_time_ms}ms
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {req.user_email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No requests found
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredRequests.length} of {requests.length} requests
      </div>
    </div>
  );
}
