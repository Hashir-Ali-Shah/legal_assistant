import { Menu, X, Plus, MessageSquare, ChevronLeft, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { formatDate, truncate } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatSidebar({ onSelectChat, onNewChat, currentSessionId, isOpen, setIsOpen }) {
    const { getChatHistory, deleteChatSession, sessionsLoaded } = useChat();
    const chatHistory = getChatHistory();
    const [confirmDelete, setConfirmDelete] = useState(null); // holds chat id to delete
    
    // Only show chats with at least one user-AI pair (2+ messages)
    const filteredHistory = chatHistory.filter(chat => 
        (chat.message_count >= 2) || (chat.messages && chat.messages.length >= 2)
    );

    const handleDelete = async (e, chatId) => {
        e.stopPropagation();
        setConfirmDelete(chatId); // open modal instead of browser alert
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete) {
            await deleteChatSession(confirmDelete);
            setConfirmDelete(null);
        }
    };

    return (
        <>
            {/* Custom Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Delete Chat</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-20 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 320 }}
                        exit={{ width: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="h-full bg-white border-r-2 border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b-2 border-gray-200 flex items-center gap-2">
                            <button
                                onClick={onNewChat}
                                className="flex-1 btn-primary flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Chat
                            </button>

                            {/* Desktop Toggle Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Collapse sidebar"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {!sessionsLoaded ? (
                                // Loading Skeleton
                                Array(5).fill(0).map((_, i) => (
                                    <div key={`skeleton-${i}`} className="w-full p-3 rounded-lg flex items-start gap-2 bg-gray-50 animate-pulse">
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No chat history yet</p>
                                </div>
                            ) : (
                                filteredHistory.map((chat) => (
                                    <motion.div
                                        key={chat.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-2 group ${chat.id === currentSessionId
                                            ? 'bg-black text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <button
                                            onClick={() => onSelectChat(chat.id)}
                                            className="flex-1 text-left min-w-0"
                                        >
                                            <h4 className="font-medium text-sm mb-1 truncate">
                                                {truncate(chat.title, 35)}
                                            </h4>
                                            <div className="text-xs opacity-75">
                                                <span>{formatDate(chat.createdAt || chat.created_at)}</span>
                                                {(chat.message_count > 0 || (chat.messages && chat.messages.length > 0)) && (
                                                    <span className="ml-2">• {chat.message_count || chat.messages?.length} msgs</span>
                                                )}
                                            </div>
                                        </button>
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, chat.id)}
                                            className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                                chat.id === currentSessionId
                                                    ? 'hover:bg-gray-700 text-white'
                                                    : 'hover:bg-red-100 text-red-500'
                                            }`}
                                            title="Delete chat"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t-2 border-gray-200 text-xs text-gray-500 text-center">
                            <p className="font-serif font-bold">Lexa v1.0</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expand Button (when sidebar is collapsed) */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-black text-white hover:bg-gray-800 transition-colors border-r-2 border-gray-200"
                    title="Expand sidebar"
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            )}

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
