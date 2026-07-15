import { useState, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { startRecording, stopRecording } from '../../api/chat/audio';
import { transcribeAudio } from '../../api/chat/chat';
import { useChat } from '../../context/ChatContext';

export default function VoiceInput({ onTranscription, disabled, compact = false }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const { currentSessionId } = useChat();
    const mediaRecorderRef = useRef(null);

    const handleStartRecording = async () => {
        try {
            setError('');
            const recorder = await startRecording();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Microphone access denied. Please allow microphone permissions.');
        }
    };

    const handleStopRecording = async () => {
        if (!mediaRecorderRef.current) return;
        setIsRecording(false);
        setIsProcessing(true);

        try {
            const audioBlob = await stopRecording(mediaRecorderRef.current);
            console.log('[VoiceInput] Audio blob:', audioBlob.size, 'bytes');

            if (audioBlob.size < 1000) {
                setError('Recording too short. Please try again.');
                return;
            }

            // Send audio to backend for transcription only
            const transcription = await transcribeAudio(currentSessionId, audioBlob);

            if (transcription && transcription.trim()) {
                if (onTranscription) onTranscription(transcription.trim());
            } else {
                setError("Couldn't understand audio. Please try again.");
            }
        } catch (err) {
            console.error('Error processing audio:', err);
            setError('Failed to process audio. Please try again.');
        } finally {
            setIsProcessing(false);
            mediaRecorderRef.current = null;
        }
    };

    // Compact mode for inline display in input bar
    if (compact) {
        return (
            <div className="flex flex-col items-end gap-1">
                <motion.button
                    type="button"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={disabled || isProcessing}
                    className={`p-3 rounded-lg transition-all duration-300 ${isRecording
                        ? 'bg-red-500 text-white ring-2 ring-red-300 ring-offset-1'
                        : isProcessing
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: disabled || isProcessing ? 1 : 1.05 }}
                    whileTap={{ scale: disabled || isProcessing ? 1 : 0.95 }}
                    animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                    transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
                    title={isProcessing ? 'Transcribing...' : isRecording ? 'Stop recording' : 'Voice input'}
                >
                    {isProcessing ? (
                        <Loader className="w-5 h-5 animate-spin" />
                    ) : isRecording ? (
                        <MicOff className="w-5 h-5" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </motion.button>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 max-w-[160px] text-right leading-tight"
                    >
                        {error}
                    </motion.span>
                )}
            </div>
        );
    }


    // Original centered mode
    return (
        <div className="flex flex-col items-center gap-2">
            <motion.button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={disabled || isProcessing}
                className={`p-4 rounded-full transition-all duration-300 ${isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: disabled || isProcessing ? 1 : 1.1 }}
                whileTap={{ scale: disabled || isProcessing ? 1 : 0.9 }}
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
            >
                {isProcessing ? (
                    <Loader className="w-6 h-6 animate-spin" />
                ) : isRecording ? (
                    <MicOff className="w-6 h-6" />
                ) : (
                    <Mic className="w-6 h-6" />
                )}
            </motion.button>

            {isRecording && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm text-red-500"
                >
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Recording...
                </motion.div>
            )}

            {isProcessing && (
                <p className="text-sm text-gray-600">Processing audio...</p>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
