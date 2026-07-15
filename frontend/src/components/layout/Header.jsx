import { Link } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Resources', href: '/resources' },
    ];

    const userNavigation = isAuthenticated
        ? [
            { name: 'Chat', href: '/chat' },
            { name: 'Profile', href: '/profile' },
        ]
        : [];

    return (
        <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-30">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <Scale className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        <span className="text-xl font-serif font-bold">Lexa</span>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center gap-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-lg text-gray-700 hover:text-black font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isAuthenticated && (
                                <>
                                    {userNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="text-lg text-gray-700 hover:text-black font-medium transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right side - Auth buttons (only when not authenticated) */}
                    {!isAuthenticated && (
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-black font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="btn-primary"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t-2 border-gray-200 overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {isAuthenticated ? (
                                    <>
                                        {userNavigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
