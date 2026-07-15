import { Scale, Target, Users } from 'lucide-react';
import Card from '../components/common/Card';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Scale className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-5xl font-serif font-bold mb-4">
                        About Lexa
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Your trusted AI-powered legal assistant
                    </p>
                </div>

                <Card className="mb-8">
                    <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Lexa is an AI-powered legal assistance platform designed to make legal information
                        accessible to everyone. Using advanced Retrieval-Augmented Generation (RAG) technology,
                        we provide accurate, context-aware answers to constitutional and legal questions.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Our mission is to democratize access to legal knowledge, helping individuals understand
                        their rights and navigate complex legal matters with confidence.
                    </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <Target className="w-10 h-10 mb-3" />
                        <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                        <p className="text-gray-700">
                            To become the most trusted and accessible AI legal assistant,
                            empowering people with knowledge and understanding of the law.
                        </p>
                    </Card>

                    <Card>
                        <Users className="w-10 h-10 mb-3" />
                        <h3 className="text-xl font-bold mb-2">Our Values</h3>
                        <p className="text-gray-700">
                            Accuracy, accessibility, transparency, and continuous improvement
                            in serving our users' legal information needs.
                        </p>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-3xl font-serif font-bold mb-4">Technology</h2>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold mb-1">Advanced RAG Pipeline</h4>
                            <p className="text-gray-700">
                                3-stage hybrid search combining vector similarity, BM25 ranking, and
                                cross-encoder reranking for maximum accuracy.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-1">Voice Input</h4>
                            <p className="text-gray-700">
                                Powered by OpenAI Whisper for accurate speech-to-text transcription.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-1">Document Processing</h4>
                            <p className="text-gray-700">
                                Support for PDF, DOCX, and TXT files with intelligent chunking and indexing.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-1">AI Model</h4>
                            <p className="text-gray-700">
                                Powered by Google Gemini for contextual, conversational responses.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
