import Link from 'next/link';
import {
  FileText,
  Search,
  FolderTree,
  Sparkles,
  PlayCircle,
  ArrowRight,
  Circle,
  Triangle,
  Square,
  Pentagon,
  Brain,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 font-sans selection:bg-[#8D1CDF] selection:text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob bg-[#8D1CDF] w-96 h-96 -top-20 -left-24 animate-pulse" />
        <div className="blob bg-[#FCE7F3] w-80 h-80 bottom-0 -right-24 dark:opacity-20" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEE2F4]/50 dark:bg-[#8D1CDF]/20 border border-[#EEE2F4] dark:border-[#8D1CDF]/30 text-[#8D1CDF] dark:text-[#FCE7F3] mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8D1CDF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8D1CDF]" />
            </span>
            <span className="text-sm font-semibold tracking-wide uppercase">
              New: Audio Transcription Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Note-taking at the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D1CDF] via-purple-500 to-pink-500">
              speed of thought with Amebo.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
            Your second brain, powered by advanced AI. Auto-summarize meetings,
            organize thoughts semantically, and never lose a great idea again.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#8D1CDF] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#8D1CDF]/25 hover:shadow-[#8D1CDF]/40 hover:bg-[#7316b5] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#181b21] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* App Preview */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8D1CDF] to-[#FCE7F3] opacity-30 blur-2xl dark:opacity-40" />
            <div className="relative bg-white dark:bg-[#181b21] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 w-full h-full opacity-90">
                {/* Sidebar Preview */}
                <div className="hidden md:flex flex-col gap-4 bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg opacity-60" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg opacity-60" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg opacity-60" />
                  <div className="mt-auto h-12 w-full bg-[#EEE2F4]/30 dark:bg-[#8D1CDF]/20 rounded-lg flex items-center px-3 gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#8D1CDF]/20" />
                    <div className="h-2 w-16 bg-[#8D1CDF]/20 rounded" />
                  </div>
                </div>

                {/* Main Content Preview */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6 bg-white dark:bg-black/40 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="h-10 w-64 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-[#E4F5DB] rounded-full" />
                      <div className="h-8 w-8 bg-[#FCE7F3] rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-50 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-11/12 bg-gray-50 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-4/5 bg-gray-50 dark:bg-gray-800 rounded" />
                  </div>

                  {/* AI Summary Box */}
                  <div className="mt-4 bg-gradient-to-br from-[#EEE2F4] to-white dark:from-[#8D1CDF]/10 dark:to-[#181b21] p-4 rounded-xl border border-[#EEE2F4] dark:border-[#8D1CDF]/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Brain className="w-16 h-16" />
                    </div>
                    <h3 className="text-sm font-bold text-[#8D1CDF] mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-[#8D1CDF]/10 rounded" />
                      <div className="h-2 w-5/6 bg-[#8D1CDF]/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-black/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Features designed for flow
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Traditional note apps are just digital paper. Amebo is a digital
              mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Summarization */}
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Smart Summarization"
              description="Instantly turn messy meeting notes into actionable bullet points. Our AI understands context, action items, and tone."
              color="lilac"
              iconColor="text-[#8D1CDF]"
            />

            {/* Semantic Search */}
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Semantic Search"
              description="Don't remember the exact keywords? No problem. Search by meaning, concept, or vague recollection. We'll find it."
              color="pink"
              iconColor="text-rose-500"
            />

            {/* Auto-Organization */}
            <FeatureCard
              icon={<FolderTree className="w-8 h-8" />}
              title="Auto-Organization"
              description="Stop manually tagging. Amebo automatically categorizes your notes into projects, topics, and urgency levels."
              color="mint"
              iconColor="text-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-[#F9FAFB] dark:bg-[#0f1115] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">
            Trusted by thinkers at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-300">
              <Circle className="w-5 h-5 text-[#8D1CDF]" /> Acme Corp
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-300">
              <Triangle className="w-5 h-5 text-[#FCE7F3]" /> Vortex
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-300">
              <Square className="w-5 h-5 text-[#E4F5DB]" /> Struc.ture
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-300">
              <Pentagon className="w-5 h-5 text-indigo-400" /> Global
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[#FFF6E7] dark:bg-[#181b21] border border-orange-100 dark:border-orange-200/10 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#8D1CDF]/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-orange-50 mb-6">
              Ready to upgrade your mind?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Join thousands of researchers, students, and professionals who
              have switched to AI-native note-taking.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="bg-[#8D1CDF] hover:bg-[#7316b5] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Get Started for Free
              </Link>
              <Link
                href="/pricing"
                className="bg-white dark:bg-white/5 dark:text-white dark:border-white/10 text-gray-900 border border-gray-200 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'lilac' | 'pink' | 'mint';
  iconColor: string;
}) {
  const bgColors = {
    lilac: 'bg-[#EEE2F4] dark:bg-[#181b21]',
    pink: 'bg-[#FCE7F3] dark:bg-[#181b21]',
    mint: 'bg-[#E4F5DB] dark:bg-[#181b21]',
  };

  const borderColors = {
    lilac: 'dark:border-[#EEE2F4]/20',
    pink: 'dark:border-[#FCE7F3]/20',
    mint: 'dark:border-[#E4F5DB]/20',
  };

  const decorColors = {
    lilac: 'bg-white/40 dark:bg-[#EEE2F4]/5',
    pink: 'bg-white/40 dark:bg-[#FCE7F3]/5',
    mint: 'bg-white/40 dark:bg-[#E4F5DB]/5',
  };

  return (
    <div
      className={`group relative p-8 rounded-2xl ${bgColors[color]} border border-transparent ${borderColors[color]} hover:scale-[1.02] transition-all duration-300`}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-white dark:bg-white/10 ${iconColor} flex items-center justify-center mb-6 shadow-sm`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
      <div className="mt-6 flex items-center font-semibold text-sm group-hover:gap-2 transition-all cursor-pointer text-[#8D1CDF]">
        Learn more <ArrowRight className="w-4 h-4 ml-1" />
      </div>
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${decorColors[color]} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}
      />
    </div>
  );
}
