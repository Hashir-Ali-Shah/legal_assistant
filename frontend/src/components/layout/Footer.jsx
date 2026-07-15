import { Link } from 'react-router-dom';
import { Scale, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const legalLinks = [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Disclaimer', href: '/disclaimer' },
    ];

    const quickLinks = [
        { name: 'About', href: '/about' },
        { name: 'Help', href: '/help' },
        { name: 'Resources', href: '/resources' },
    ];

    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 group mb-4">
                            <Scale className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                            <span className="text-xl font-serif font-bold text-white">Lexa</span>
                        </Link>
                        <p className="text-gray-400 text-sm mt-2">
                            Your AI-powered legal assistant, providing instant access to legal information
                            and document analysis.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/resources" className="text-gray-400 hover:text-white transition-colors">
                                    Resources
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>support@lexa.ai</li>
                            <li>1-800-LEGAL-AI</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>
                        © {currentYear} Lexa. All rights reserved.
                    </p>

                    <div className="flex justify-center gap-4 mt-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
