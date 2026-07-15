import { useChat } from '../../context/ChatContext';
import { sendChatMessage, warmupBackend } from '../../api/chat/chat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import { useState, useEffect } from 'react';

export default function ChatInterface() {
    const { 
        messages, 
        addMessage, 
        updateLastMessage, 
        loading, 
        setLoading, 
        setError, 
        startNewChat, 
        loadChatSession, 
        currentSessionId,
        setCurrentSessionId,
        refreshSessions,
        createSession,
    } = useChat();
    const [streamingMessage, setStreamingMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [voiceText, setVoiceText] = useState('');  // populated by mic, injected into input bar

    // Silent warmup: pre-load embedding model + Pinecone on first mount
    useEffect(() => {
        warmupBackend();
    }, []);

    const handleSendMessage = async (message, files = []) => {
        console.log('[ChatInterface] handleSendMessage called');
        console.log('[ChatInterface] currentSessionId:', currentSessionId);
        console.log('[ChatInterface] message:', message);

        // Add user message and loading state IMMEDIATELY before any async work
        // so the UI feels instant regardless of backend latency
        addMessage({
            role: 'user',
            content: message,
            attachedFiles: files.length > 0 ? files.map(f => f.name) : undefined,
        });
        setLoading(true);
        setStreamingMessage('');
        addMessage({
            role: 'assistant',
            content: '',
        });

        // Ensure we have a session ID (may require a network call)
        let sessionId = currentSessionId;
        if (!sessionId) {
            console.log('[ChatInterface] No session ID, creating new session...');
            const title = message.substring(0, 50);
            sessionId = await createSession(title);
            if (!sessionId) {
                sessionId = crypto.randomUUID();
                setCurrentSessionId(sessionId);
            }
        }

        try {
            console.log('[ChatInterface] Calling sendChatMessage with sessionId:', sessionId);
            let fullResponse = '';

            await sendChatMessage(
                sessionId,
                message,
                files,
                (token) => {
                    fullResponse += token;
                    
                    let displayContent = fullResponse;
                    let agentStatus = null;
                    let clarificationQuestions = null;
                    let documentDraft = null;
                    
                    if (displayContent.includes('[__RETRIEVING__]')) {
                        agentStatus = 'retrieving';
                        displayContent = displayContent.replace(/\[__RETRIEVING__\]/g, '');
                    }
                    if (displayContent.includes('[__PROCESSING__]')) {
                        agentStatus = 'processing';
                        displayContent = displayContent.replace(/\[__PROCESSING__\]/g, '');
                    }
                    if (displayContent.includes('[__CLARIFICATION_FORM__]')) {
                        const match = displayContent.match(/\[__CLARIFICATION_FORM__\](.*?)\[__END_FORM__\]/);
                        if (match) {
                            try {
                                clarificationQuestions = JSON.parse(match[1]);
                            } catch(e) {
                                console.error("Failed to parse clarification JSON", e);
                            }
                            displayContent = displayContent.replace(/\[__CLARIFICATION_FORM__\].*?\[__END_FORM__\]/, '');
                        }
                    }
                    if (displayContent.includes('[__DOCUMENT_DRAFT__]')) {
                        const match = displayContent.match(/\[__DOCUMENT_DRAFT__\](.*?)\[__END_DRAFT__\]/);
                        if (match) {
                            try {
                                documentDraft = JSON.parse(match[1]);
                            } catch(e) {
                                console.error("Failed to parse document draft JSON", e);
                            }
                            displayContent = displayContent.replace(/\[__DOCUMENT_DRAFT__\].*?\[__END_DRAFT__\]/, '');
                        }
                    }
                    
                    // If LLM starts actually typing out the answer, transition away from processing
                    if (agentStatus === 'processing' && displayContent.trim().length > 0) {
                        agentStatus = null;
                    }
                    
                    setStreamingMessage(displayContent);
                    updateLastMessage({ content: displayContent, agentStatus, clarificationQuestions, documentDraft });
                }
            );

            console.log('[ChatInterface] sendChatMessage completed');
            setStreamingMessage('');
            
            // Refresh sessions immediately for message count, then again after 3s
            // so the AI-generated title (fire-and-forget) has time to be saved to DB
            if (refreshSessions) {
                refreshSessions();
                setTimeout(() => refreshSessions(), 3000);
            }
        } catch (err) {
            console.error('[ChatInterface] Error sending message:', err);
            setError('Failed to send message. Please try again.');
            updateLastMessage({
                content: 'Sorry, I encountered an error. Please try again.',
                error: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Voice transcription populates the input bar — does NOT auto-send.
    // User can review, edit, or add more text before pressing Send.
    const handleVoiceTranscription = (transcription) => {
        if (transcription) {
            setVoiceText(prev => prev ? prev + ' ' + transcription : transcription);
        }
    };

    const handleNewChat = () => {
        startNewChat();
    };

    const handleSelectChat = (sessionId) => {
        loadChatSession(sessionId);
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <ChatSidebar
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                currentSessionId={currentSessionId}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Chat Area */}
            <div
                className="flex-1 flex flex-col min-w-0 transition-all duration-300"
            >
                <MessageList messages={messages} loading={loading && !streamingMessage} onSendMessage={handleSendMessage} />

                <ChatInput
                    onSendMessage={handleSendMessage}
                    onVoiceTranscription={handleVoiceTranscription}
                    voiceText={voiceText}
                    onVoiceTextConsumed={() => setVoiceText('')}
                    disabled={loading}
                />
            </div>
        </div>
    );
}
