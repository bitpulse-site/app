import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface StandardPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBackButton?: boolean;
}

export default function StandardPageLayout({ 
  title, 
  subtitle, 
  children,
  showBackButton = true 
}: StandardPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBackButton && (
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        )}

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-lg">{subtitle}</p>
          )}
        </header>

        <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-8 sm:p-12">
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
