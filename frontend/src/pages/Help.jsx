import { HelpCircle, MessageSquare, Book, Settings } from 'lucide-react';
import Card from '../components/common/Card';

export default function Help() {
    const faqs = [
        {
            question: 'How do I ask a question?',
            answer: 'Simply type your legal question in the chat interface or use the microphone button for voice input. Our AI will analyze your question and provide a detailed answer.',
        },
        {
            question: 'What types of documents can I upload?',
            answer: 'Lexa supports PDF (.pdf), Word documents (.docx, .doc), and text files (.txt). Maximum file size is 10MB.',
        },
        {
            question: 'Is voice input available?',
            answer: 'Yes! Click the microphone button in the chat input to use voice input. Make sure to allow microphone access when prompted.',
        },
        {
            question: 'How do I start a new conversation?',
            answer: 'Click the "New Chat" button in the sidebar or use the keyboard shortcut Ctrl+N (Cmd+N on Mac).',
        },
        {
            question: 'Can I view my chat history?',
            answer: 'Yes, all your conversations are saved and accessible from the sidebar. Click on any previous chat to continue it.',
        },
        {
            question: 'How accurate are the legal answers?',
            answer: 'Lexa uses advanced RAG technology to provide accurate answers based on legal documents and context. However, always consult a licensed attorney for legal advice.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-5xl font-serif font-bold mb-4">
                        Help Center
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions
                    </p>
                </div>

                {/* Quick Start Guide */}
                <Card className="mb-8">
                    <h2 className="text-2xl font-serif font-bold mb-4">Quick Start Guide</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Create an Account</h3>
                                <p className="text-gray-700">
                                    Sign up with your email to get started. It's free and takes less than a minute.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Start a Chat</h3>
                                <p className="text-gray-700">
                                    Navigate to the Chat page and type your legal question. You can also upload relevant documents.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Get Answers</h3>
                                <p className="text-gray-700">
                                    Our AI will analyze your question and provide a detailed, contextual answer in real-time.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* FAQs */}
                <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Card key={index}>
                                <h3 className="font-bold mb-2">{faq.question}</h3>
                                <p className="text-gray-700">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <Card>
                    <h2 className="text-2xl font-serif font-bold mb-4">Still Need Help?</h2>
                    <p className="text-gray-700 mb-4">
                        If you couldn't find the answer you were looking for, please reach out to us:
                    </p>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <strong>Email:</strong> support@lawbot.com
                        </p>
                        <p className="text-gray-700">
                            <strong>Response Time:</strong> Within 24 hours
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
