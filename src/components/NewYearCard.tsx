import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThreeScene from './ThreeScene';
import QuoteDisplay from './QuoteDisplay';

const positiveQuotes = [
  "In 2082, our dreams have no limits.\nMay your vision transform the future.",
  "A new year in a new era.\nMay your innovations light up 2082.",
  "The future is yours to create.\nEmbrace 2082 with boundless optimism.",
  "In this age of wonders,\nmay 2082 bring you prosperity and joy.",
  "As we reach for the stars,\nmay 2082 fulfill your boldest ambitions.",
  "The horizons of 2082 await your brilliance.\nHappy New Year!",
  "May your path through 2082 be illuminated\nwith discovery and delight.",
  "In this remarkable age,\nmay 2082 exceed your wildest dreams."
];

const NewYearCard: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleButtonClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setHasStarted(true);
    
    // Select random quote
    const randomIndex = Math.floor(Math.random() * positiveQuotes.length);
    setQuoteIndex(randomIndex);
    setCurrentQuote(positiveQuotes[randomIndex]);
    
    // Show quote after a delay
    setTimeout(() => {
      setShowQuote(true);
    }, 2000);
  };

  const handleAnimationComplete = () => {
    // Keep animation running but allow button to be clicked again
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    
    // Hide quote after animation completes
    setTimeout(() => {
      setShowQuote(false);
    }, 5000);
  };

  // Change quote periodically if animation is still active
  useEffect(() => {
    if (!isAnimating || !showQuote) return;
    
    const interval = setInterval(() => {
      let nextIndex = (quoteIndex + 1) % positiveQuotes.length;
      setQuoteIndex(nextIndex);
      setCurrentQuote(positiveQuotes[nextIndex]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAnimating, showQuote, quoteIndex]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-future-dark to-black z-0" />
      
      {/* Content */}
      <div className="relative z-10 text-center p-6">
        <h1 className="mb-8 text-5xl md:text-6xl lg:text-7xl font-bold future-text">
          New Year 2082
        </h1>
        
        <p className="mb-12 text-lg md:text-xl text-future-glow max-w-md mx-auto">
          Step into the future and discover what awaits in the new year. Experience the wonders of 2082.
        </p>
        
        <Button 
          onClick={handleButtonClick}
          disabled={isAnimating}
          className="relative px-8 py-6 text-lg bg-future-primary hover:bg-future-primary/90 text-white rounded-lg transition-all duration-300 overflow-hidden holographic"
        >
          <span className="relative z-10">
            {!hasStarted 
              ? "Celebrate 2082" 
              : isAnimating 
                ? "Experiencing the Future..." 
                : "Explore More Visions"
            }
          </span>
        </Button>
      </div>
      
      {/* 3D Animation */}
      {hasStarted && (
        <ThreeScene 
          isActive={isAnimating} 
          onAnimationComplete={handleAnimationComplete} 
        />
      )}
      
      {/* Quote Display */}
      <QuoteDisplay quote={currentQuote} isVisible={showQuote} />
    </div>
  );
};

export default NewYearCard;
