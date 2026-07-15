import { useState, useEffect } from 'react';
import { 
    BarChart3, 
    Coins, 
    MessageSquare, 
    TrendingUp,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import Card from '../common/Card';
import { getUsageSummary, getDailyUsage, getSessionUsage } from '../../api/analytics';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function UsageSection() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [sessionData, setSessionData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [summaryRes, dailyRes, sessionRes] = await Promise.all([
                getUsageSummary(30),
                getDailyUsage(30),
                getSessionUsage(10)
            ]);
            
            setSummary(summaryRes);
            // Reverse to show oldest first for chart
            setDailyData(dailyRes.data.reverse());
            setSessionData(sessionRes.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load usage data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format cost for display
    const formatCost = (cost) => {
        if (cost < 0.01) return `$${cost.toFixed(6)}`;
        if (cost < 1) return `$${cost.toFixed(4)}`;
        return `$${cost.toFixed(2)}`;
    };

    // Format tokens with K/M suffix
    const formatTokens = (tokens) => {
        if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
        if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
        return tokens.toString();
    };

    // Prepare model breakdown for pie chart
    const getModelData = () => {
        if (!summary?.by_model) return [];
        return Object.entries(summary.by_model).map(([model, data]) => ({
            name: model.split('/')[1] || model,
            value: data.tokens,
            cost: data.cost,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-3 text-gray-600">Loading usage data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="flex items-center justify-center py-8 text-red-500">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <span>{error}</span>
                </div>
            </Card>
        );
    }

    const stats = [
        {
            label: 'Total Tokens',
            value: formatTokens(summary?.total_tokens || 0),
            icon: <BarChart3 className="w-6 h-6" />,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Total Cost',
            value: formatCost(summary?.total_cost_usd || 0),
            icon: <Coins className="w-6 h-6" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Requests',
            value: summary?.total_requests || 0,
            icon: <MessageSquare className="w-6 h-6" />,
            color: 'bg-purple-100 text-purple-600',
        },
    ];

    const modelData = getModelData();

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">
                    Usage & Analytics
                </h1>
                <p className="text-gray-600">
                    Track your token usage and costs over the last 30 days.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Daily Usage Chart */}
            <Card className="mb-8">
                <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Token Usage (Last 30 Days)
                </h2>
                {dailyData.length > 0 ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(date) => {
                                        const dateStr = typeof date === 'string' ? date.replace(' ', 'T') : date;
                                        const d = new Date(dateStr);
                                        return isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`;
                                    }}
                                    fontSize={12}
                                />
                                <YAxis 
                                    tickFormatter={formatTokens}
                                    fontSize={12}
                                />
                                <Tooltip 
                                    formatter={(value, name) => [
                                        name === 'tokens' ? formatTokens(value) : formatCost(value),
                                        name === 'tokens' ? 'Tokens' : 'Cost'
                                    ]}
                                    labelFormatter={(date) => {
                                        const dateStr = typeof date === 'string' ? date.replace(' ', 'T') : date;
                                        const d = new Date(dateStr);
                                        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="tokens" 
                                    stroke="#0088FE" 
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        No usage data yet. Start chatting to see your usage!
                    </div>
                )}
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Model Breakdown */}
                <Card>
                    <h2 className="text-lg font-bold mb-4">Usage by Model</h2>
                    {modelData.length > 0 ? (
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={modelData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        label={(entry) => entry.name}
                                        labelLine={false}
                                    >
                                        {modelData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => formatTokens(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                            No model data yet
                        </div>
                    )}
                </Card>

                {/* Session Usage */}
                <Card>
                    <h2 className="text-lg font-bold mb-4">Top Sessions by Usage</h2>
                    {sessionData.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {sessionData.map((session, index) => (
                                <div 
                                    key={session.session_id} 
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {session.title}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-sm font-bold">
                                            {formatTokens(session.tokens)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatCost(session.cost)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                            No session data yet
                        </div>
                    )}
                </Card>
            </div>

            {/* Input/Output Breakdown */}
            {summary && (
                <Card>
                    <h2 className="text-lg font-bold mb-4">Token Breakdown</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Input Tokens</p>
                            <p className="text-xl font-bold text-blue-600">
                                {formatTokens(summary.total_input_tokens || 0)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">Output Tokens</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatTokens(summary.total_output_tokens || 0)}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}
