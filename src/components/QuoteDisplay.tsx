
import React from 'react';
import { cn } from '@/lib/utils';

interface QuoteDisplayProps {
  quote: string;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isVisible }) => {
  return (
    <div 
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center transition-all duration-1000 ease-in-out p-8 rounded-xl",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl glow-effect">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold future-text whitespace-pre-line">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
