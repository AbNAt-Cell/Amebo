'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function SplashScreen() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Hide splash screen after 2 seconds
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#0d1117] flex items-center justify-center transition-opacity duration-500 animate-out fade-out slide-out-to-top-10 fill-mode-forwards">
            <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#8D1CDF] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-[#8D1CDF]/30 animate-in zoom-in spin-in-3 duration-700">
                    <Sparkles className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Amebo
                </h1>
                <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                    Your Smart AI Assistant
                </p>
            </div>
        </div>
    );
}
