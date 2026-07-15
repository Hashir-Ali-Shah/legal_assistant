import { useState } from 'react';

export default function ErrorLogsViewer({ errors, onRefresh }) {
  const [expandedError, setExpandedError] = useState(null);

  const toggleError = (id) => {
    setExpandedError(expandedError === id ? null : id);
  };

  const copyError = (error) => {
    const text = `Endpoint: ${error.endpoint}
Method: ${error.method}
Status: ${error.status_code}
Time: ${new Date(error.timestamp).toLocaleString()}
User: ${error.user_email}
Error: ${error.error_message}`;
    
    navigator.clipboard.writeText(text);
  };

  if (errors.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Error Logs</h3>
        <div className="text-center text-green-400 py-8">
          ✓ No errors in the last 24 hours
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">
          Error Logs <span className="text-red-400">({errors.length})</span>
        </h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {errors.map((error) => (
          <div
            key={error.id}
            className="border border-red-500/30 bg-red-500/10 rounded-lg overflow-hidden"
          >
            {/* Error Header */}
            <div
              onClick={() => toggleError(error.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-500/20 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <span className="text-red-400 font-medium">{error.status_code}</span>
                  <span className="text-gray-300 font-mono text-sm">{error.endpoint}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(error.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyError(error);
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                >
                  Copy
                </button>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedError === error.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Error Details (Expandable) */}
            {expandedError === error.id && (
              <div className="px-4 pb-4 space-y-2 border-t border-red-500/30">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-xs">Method</p>
                    <p className="text-gray-300 font-mono">{error.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">User</p>
                    <p className="text-gray-300">{error.user_email}</p>
                  </div>
                </div>
                
                {error.error_message && (
                  <div className="mt-4">
                    <p className="text-gray-500 text-xs mb-1">Error Message</p>
                    <div className="bg-black/50 p-3 rounded border border-gray-700">
                      <p className="text-red-300 text-sm font-mono whitespace-pre-wrap">
                        {error.error_message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
