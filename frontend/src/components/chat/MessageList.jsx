import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { InlineLoading } from '../common/Loading';

export default function MessageList({ messages, loading, onSendMessage }) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const prevMessageCountRef = useRef(messages.length);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        // Only scroll to bottom when a new message is added
        if (messages.length > prevMessageCountRef.current) {
            scrollToBottom();
        }
        prevMessageCountRef.current = messages.length;
    }, [messages.length]);

    if (messages.length === 0 && !loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚖️</div>
                    <h3 className="text-xl font-serif font-bold mb-2">
                        Welcome to Lexa
                    </h3>
                    <p className="text-gray-400 mt-2">
                        Your AI-powered legal assistant. Ask me anything about law, upload documents,
                        or start a conversation. upload documents for contextual answers.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onSendMessage={onSendMessage} />
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-6 py-4">
                        <InlineLoading message="Thinking..." />
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
