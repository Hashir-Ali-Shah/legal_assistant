import { Link } from 'react-router-dom';
import { MessageSquare, History, FileText, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

export default function DashboardSection({ onNavigate }) {
    const { user } = useAuth();
    const { getChatHistory, startNewChat } = useChat();
    const history = getChatHistory();
    const recentChats = history.slice(0, 5);

    const stats = [
        {
            label: 'Total Chats',
            value: history.length,
            icon: <MessageSquare className="w-6 h-6" />,
        },
        {
            label: 'Documents Uploaded',
            value: 0,
            icon: <FileText className="w-6 h-6" />,
        },
        {
            label: 'Questions Asked',
            value: history.reduce((acc, chat) => acc + (chat.messageCount || 0), 0),
            icon: <History className="w-6 h-6" />,
        },
    ];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
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

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-serif font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/chat" onClick={startNewChat}>
                        <Card clickable>
                            <div className="flex items-center gap-3">
                                <Plus className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">Start New Chat</h3>
                                    <p className="text-sm text-gray-600">Ask a legal question</p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <button onClick={() => onNavigate('documents')} className="text-left">
                        <Card clickable>
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">Upload Document</h3>
                                    <p className="text-sm text-gray-600">Add legal documents</p>
                                </div>
                            </div>
                        </Card>
                    </button>
                </div>
            </div>

            {/* Recent Chats */}
            <div>
                <h2 className="text-xl font-serif font-bold mb-4">Recent Chats</h2>
                {recentChats.length === 0 ? (
                    <Card>
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-600 mb-4">No chats yet</p>
                            <Link to="/chat" onClick={startNewChat}>
                                <Button>Start Your First Chat</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {recentChats.map((chat) => (
                            <Link key={chat.id} to="/chat">
                                <Card clickable>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium mb-1">{chat.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(chat.createdAt)}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
