import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import Button from '../common/Button';
import VoiceInput from './VoiceInput';
import { validateFile } from '../../api/chat/chat';
import { formatFileSize } from '../../utils/helpers';
import { useChat } from '../../context/ChatContext';

export default function ChatInput({ onSendMessage, onVoiceTranscription, voiceText, onVoiceTextConsumed, disabled }) {
    const [message, setMessage] = useState('');
    const { uploadedFiles, addFile, removeFile, clearFiles } = useChat();
    const [fileError, setFileError] = useState('');
    const textareaRef = useRef(null);

    // When parent injects voice transcription, append it into the textarea and focus
    useEffect(() => {
        if (voiceText) {
            setMessage(prev => prev ? prev + ' ' + voiceText : voiceText);
            if (onVoiceTextConsumed) onVoiceTextConsumed();
            // Focus the textarea so user can immediately edit or press Enter
            setTimeout(() => textareaRef.current?.focus(), 50);
        }
    }, [voiceText]);

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto';
            // Set height to scrollHeight, capped by max-height in CSS
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [message]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setFileError('');

        files.forEach(file => {
            const validation = validateFile(file);
            if (validation.valid) {
                addFile(file);
            } else {
                setFileError(validation.error);
            }
        });

        // Reset input
        e.target.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim() && uploadedFiles.length === 0) return;

        onSendMessage(message, uploadedFiles.map(f => f.file));
        setMessage('');
        clearFiles();
        setFileError('');

        // Reset textarea height after sending
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        // Enter without Shift = submit
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
        // Shift+Enter = new line (default behavior, no prevention needed)
    };

    return (
        <div className="border-t-2 border-gray-200 bg-white p-4">
            {/* File Preview */}
            {uploadedFiles.length > 0 && (
                <div className="mb-3 space-y-2">
                    {uploadedFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
                        >
                            <Paperclip className="w-4 h-4 text-gray-600" />
                            <span className="flex-1 text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                            <button
                                onClick={() => removeFile(file.id)}
                                className="text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* File Error */}
            {fileError && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {fileError}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <div className="flex-1 flex items-end gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.docx,.doc,.txt"
                        multiple
                        onChange={handleFileSelect}
                        disabled={disabled}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`cursor-pointer text-gray-600 hover:text-black transition-colors flex-shrink-0 pb-0.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <Paperclip className="w-5 h-5" />
                    </label>

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-transparent border-none outline-none resize-none min-h-[24px] max-h-[150px] overflow-y-auto leading-6"
                        disabled={disabled}
                        rows={1}
                    />
                </div>

                {/* Voice Input Button */}
                <VoiceInput
                    onTranscription={onVoiceTranscription}
                    disabled={disabled}
                    compact={true}
                />

                <Button
                    type="submit"
                    disabled={disabled || (!message.trim() && uploadedFiles.length === 0)}
                    icon={<Send className="w-4 h-4" />}
                >
                    Send
                </Button>
            </form>

            <p className="text-xs text-gray-500 mt-2">
                Supported files: PDF, DOCX, TXT (max 10MB) • Shift+Enter for new line
            </p>
        </div>
    );
}

