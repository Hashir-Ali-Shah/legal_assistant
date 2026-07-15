import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Search, Trash2, MessageSquare } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function ChatHistory() {
    const { getChatHistory, deleteChatSession, loadChatSession } = useChat();
    const [searchQuery, setSearchQuery] = useState('');
    const history = getChatHistory();

    const filteredHistory = history.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (e, sessionId) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to delete this chat?')) {
            deleteChatSession(sessionId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold mb-2">
                        Chat History
                    </h1>
                    <p className="text-gray-600">
                        View and manage your previous conversations
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {/* Chat List */}
                {filteredHistory.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-bold mb-2">
                                {searchQuery ? 'No chats found' : 'No chat history yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Start a conversation to see it here'
                                }
                            </p>
                            {!searchQuery && (
                                <Link to="/chat">
                                    <Button>Start New Chat</Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((chat) => (
                            <Link
                                key={chat.id}
                                to="/chat"
                                onClick={() => loadChatSession(chat.id)}
                            >
                                <Card clickable>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1">
                                                {chat.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {chat.messageCount} messages • {formatDate(chat.createdAt)}
                                            </p>
                                            {chat.messages && chat.messages[0] && (
                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                    {chat.messages[0].content}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(e, chat.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete chat"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
