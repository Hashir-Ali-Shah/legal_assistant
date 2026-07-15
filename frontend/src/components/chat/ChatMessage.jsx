import { User, Bot, Copy, Check, Search, Loader2, Download, FileText, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { formatDate, copyToClipboard } from '../../utils/helpers';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message, onSendMessage }) {
    const [copied, setCopied] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const isUser = message.role === 'user';

    const handleCopy = async () => {
        const success = await copyToClipboard(message.content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (!message.documentDraft) return;
        const blob = new Blob([message.documentDraft.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${message.documentDraft.type.replace(/\s+/g, '_').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClarificationSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        let formattedResponse = "[User Clarification Answers]\n";
        message.clarificationQuestions.forEach((q, idx) => {
            const answer = formData.get(`q_${idx}`);
            formattedResponse += `${idx + 1}. ${q} -> ${answer}\n`;
        });
        formattedResponse += "Please continue your legal analysis based on these facts.";
        
        setFormSubmitted(true);
        if (onSendMessage) {
            onSendMessage(formattedResponse);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                </div>
            )}

            <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
                <div
                    className={`rounded-2xl px-6 py-4 ${isUser
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-black shadow-sm'
                        }`}
                >
                    {message.agentStatus === 'retrieving' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 text-blue-600 mb-2 font-medium bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                            <Search className="w-4 h-4 animate-pulse" />
                            <span className="text-sm">Searching legal database...</span>
                        </motion.div>
                    )}
                    {message.agentStatus === 'processing' && !message.content && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 text-purple-600 mb-2 font-medium bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Processing retrieved context...</span>
                        </motion.div>
                    )}
                    {message.content && (
                        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                            <ReactMarkdown>
                                {isUser && message.content.includes('[User Clarification Answers]')
                                    ? message.content
                                        .replace('[User Clarification Answers]\n', '')
                                        .replace('\nPlease continue your legal analysis based on these facts.', '')
                                    : message.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Attached file badges — shown in user messages only */}
                    {isUser && message.attachedFiles && message.attachedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {message.attachedFiles.map((name, idx) => (
                                <span key={idx} className="flex items-center gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30">
                                    <Paperclip className="w-3 h-3" />
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {message.clarificationQuestions && !isUser && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-sm mb-3 text-black">Please provide more details:</h4>
                            <form onSubmit={handleClarificationSubmit}>
                                {message.clarificationQuestions.map((q, idx) => (
                                    <div key={idx} className="mb-3">
                                        <label className="text-xs font-medium text-gray-700">{q}</label>
                                        <input 
                                            type="text" 
                                            name={`q_${idx}`}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                            placeholder="Your answer..."
                                            required
                                            disabled={formSubmitted}
                                        />
                                    </div>
                                ))}
                                <button 
                                    type="submit" 
                                    disabled={formSubmitted}
                                    className={`mt-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        formSubmitted 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {formSubmitted ? 'Submitted' : 'Submit Answers'}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {message.documentDraft && !isUser && (
                        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white text-black shadow-sm">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                    <FileText className="w-5 h-5" />
                                    <span>{message.documentDraft.type}</span>
                                </div>
                                <button 
                                    onClick={handleDownload} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <ReactMarkdown>{message.documentDraft.content}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`flex items-center gap-2 mt-1 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">
                        {formatDate(message.timestamp)}
                    </span>
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-black transition-colors p-1"
                            title="Copy message"
                        >
                            {copied ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 text-black rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                </div>
            )}
        </motion.div>
    );
}
