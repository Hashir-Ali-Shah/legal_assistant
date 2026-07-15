import { Link } from 'react-router-dom';
import { Scale, MessageSquare, FileText, Mic, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

export default function Home() {
    const features = [
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'AI-Powered Conversations',
            description: 'Get instant, accurate answers to your legal questions powered by advanced AI technology.',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Document Analysis',
            description: 'Upload legal documents (PDF, DOCX, TXT) for contextual analysis and insights.',
        },
        {
            icon: <Mic className="w-8 h-8" />,
            title: 'Voice Input',
            description: 'Ask questions using your voice for a hands-free legal assistance experience.',
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'RAG Technology',
            description: 'Advanced retrieval-augmented generation ensures responses are grounded in real legal context.',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Constitutional Law',
            description: 'Specialized in constitutional and legal matters with comprehensive knowledge base.',
        },
        {
            icon: <Scale className="w-8 h-8" />,
            title: 'Always Available',
            description: '24/7 access to legal information whenever you need it, wherever you are.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Scale className="w-20 h-20 mx-auto mb-6" />
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                            Legal Assistance,<br />
                            Powered by AI
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Get instant, accurate answers to your constitutional and legal questions
                            with our advanced AI-powered assistant.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button size="lg" variant="secondary">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need for comprehensive legal assistance in one platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card hover:border-gray-400"
                            >
                                <div className="mb-4 text-black">{feature.icon}</div>
                                <h3 className="text-xl font-serif font-bold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Join thousands of users who trust Lexa for their legal questions.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" variant="secondary">
                            Create Your Account
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
