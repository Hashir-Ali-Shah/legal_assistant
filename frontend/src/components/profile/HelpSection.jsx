import Card from '../common/Card';

export default function HelpSection() {
    const faqs = [
        {
            question: 'How do I ask a question?',
            answer: 'Simply type your legal question in the chat interface or use the microphone button for voice input.',
        },
        {
            question: 'What types of documents can I upload?',
            answer: 'Lexa supports PDF (.pdf), Word documents (.docx, .doc), and text files (.txt). Maximum file size is 10MB.',
        },
        {
            question: 'How does voice input work?',
            answer: 'Click the microphone button, speak your question, then click again to stop.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes. Chat sessions are stored locally in your browser and are not shared.',
        },
    ];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Help Center</h1>
                <p className="text-gray-600">Find answers to common questions</p>
            </div>

            <Card className="mb-6">
                <h2 className="text-xl font-bold mb-4">Quick Start Guide</h2>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                            <h3 className="font-bold mb-1">Create an Account</h3>
                            <p className="text-gray-700 text-sm">Sign up with your email to get started.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                            <h3 className="font-bold mb-1">Start a Chat</h3>
                            <p className="text-gray-700 text-sm">Navigate to Chat and type your legal question.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                            <h3 className="font-bold mb-1">Get Answers</h3>
                            <p className="text-gray-700 text-sm">Our AI will provide detailed, contextual answers.</p>
                        </div>
                    </div>
                </div>
            </Card>

            <h2 className="text-xl font-bold mb-4">FAQs</h2>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <Card key={index}>
                        <h3 className="font-bold mb-2">{faq.question}</h3>
                        <p className="text-gray-700 text-sm">{faq.answer}</p>
                    </Card>
                ))}
            </div>
        </>
    );
}
