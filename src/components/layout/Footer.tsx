import Link from 'next/link';
import { Sparkles, Twitter, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#0f1115] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-[#8D1CDF] flex items-center justify-center text-white">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                Amebo
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Making knowledge management effortless for everyone through the
                            power of artificial intelligence.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>
                                <Link href="#features" className="hover:text-[#8D1CDF] transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-[#8D1CDF] transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/enterprise" className="hover:text-[#8D1CDF] transition-colors">
                                    Enterprise
                                </Link>
                            </li>
                            <li>
                                <Link href="/changelog" className="hover:text-[#8D1CDF] transition-colors">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>
                                <Link href="/docs" className="hover:text-[#8D1CDF] transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="hover:text-[#8D1CDF] transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-[#8D1CDF] transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="hover:text-[#8D1CDF] transition-colors">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>
                                <Link href="/privacy" className="hover:text-[#8D1CDF] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-[#8D1CDF] transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="hover:text-[#8D1CDF] transition-colors">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Amebo Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#8D1CDF] transition-colors"
                        >
                            <span className="sr-only">Twitter</span>
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#8D1CDF] transition-colors"
                        >
                            <span className="sr-only">GitHub</span>
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
