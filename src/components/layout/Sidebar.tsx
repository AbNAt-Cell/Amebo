'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Sparkles,
    FileText,
    FolderOpen,
    Search,
    Settings,
    LogOut,
    Plus,
    ChevronLeft,
    ChevronRight,
    Mic,
    Bot,
    Sun,
    Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface SidebarProps {
    user?: {
        name: string;
        email: string;
        avatarUrl?: string;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const navigation = [
        { name: 'All Notes', href: '/dashboard', icon: FileText },
        { name: 'Folders', href: '/dashboard/folders', icon: FolderOpen },
        { name: 'Search', href: '/dashboard/search', icon: Search },
        { name: 'AI Assistant', href: '/dashboard/assistant', icon: Bot },
        { name: 'Transcribe', href: '/dashboard/transcribe', icon: Mic },
    ];

    return (
        <aside
            className={cn(
                'h-screen bg-white dark:bg-[#181b21] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8D1CDF] flex items-center justify-center text-white flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            Amebo
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* New Note Button */}
            <div className="p-3">
                <Link
                    href="/dashboard/notes/new"
                    className={cn(
                        'flex items-center gap-2 bg-[#8D1CDF] hover:bg-[#7316b5] text-white rounded-xl font-medium transition-all',
                        collapsed ? 'p-2 justify-center' : 'px-4 py-2.5'
                    )}
                >
                    <Plus className="w-5 h-5" />
                    {!collapsed && <span>New Note</span>}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                                isActive
                                    ? 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 text-[#8D1CDF]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                                collapsed && 'justify-center px-2'
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-1">
                <Link
                    href="/dashboard/settings/billing"
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all',
                        collapsed && 'justify-center px-2'
                    )}
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Settings</span>}
                </Link>

                {/* User Profile */}
                {user && (
                    <div
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50',
                            collapsed && 'justify-center px-2'
                        )}
                    >
                        <div className="w-8 h-8 rounded-full bg-[#8D1CDF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full',
                        collapsed && 'justify-center px-2'
                    )}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <Moon className="w-5 h-5 flex-shrink-0" />
                    )}
                    {!collapsed && <span className="font-medium">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>}
                </button>

                <button
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full',
                        collapsed && 'justify-center px-2'
                    )}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
