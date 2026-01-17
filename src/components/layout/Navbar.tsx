'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed w-full z-50 top-0 left-0 transition-all duration-300',
                isScrolled
                    ? 'border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md bg-white/70 dark:bg-[#0f1115]/80'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8D1CDF] flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Amebo
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link
                            href="#features"
                            className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] dark:hover:text-[#8D1CDF] transition-colors font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] dark:hover:text-[#8D1CDF] transition-colors font-medium"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] dark:hover:text-[#8D1CDF] transition-colors font-medium"
                        >
                            About
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] dark:hover:text-[#8D1CDF] font-medium"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-[#8D1CDF] hover:bg-[#7316b5] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#8D1CDF]/20 hover:shadow-[#8D1CDF]/40 transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-[#0f1115] border-b border-gray-200 dark:border-gray-800 p-4 animate-fade-in-up">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="#features"
                                className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/login"
                                className="text-gray-600 dark:text-gray-300 hover:text-[#8D1CDF] font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
