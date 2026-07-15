import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSystemHealth, getRequestMetrics, getErrorLogs, getAdminTokenUsage } from '../../api/admin';
import HealthStatusCards from '../../components/admin/HealthStatusCards';
import TokenUsageChart from '../../components/admin/TokenUsageChart';
import RequestTrackingTable from '../../components/admin/RequestTrackingTable';
import ErrorLogsViewer from '../../components/admin/ErrorLogsViewer';
import Button from '../../components/common/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [requests, setRequests] = useState([]);
  const [errors, setErrors] = useState([]);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [healthData, requestsData, errorsData, tokenData] = await Promise.all([
        getSystemHealth(),
        getRequestMetrics({ limit: 100, hours: 24 }),
        getErrorLogs({ limit: 50, hours: 24 }),
        getAdminTokenUsage(7),
      ]);

      setHealth(healthData);
      setRequests(requestsData.data);
      setErrors(errorsData.data);
      setTokenUsage(tokenData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('[Admin] Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Health Status Cards */}
      {health && <HealthStatusCards health={health} />}

      {/* Token Usage Chart */}
      {tokenUsage && (
        <div className="mt-8">
          <TokenUsageChart data={tokenUsage} />
        </div>
      )}

      {/* Request Tracking Table */}
      <div className="mt-8">
        <RequestTrackingTable requests={requests} onRefresh={fetchData} />
      </div>

      {/* Error Logs Viewer */}
      <div className="mt-8">
        <ErrorLogsViewer errors={errors} onRefresh={fetchData} />
      </div>
    </div>
  );
}
