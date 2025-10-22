import { useEffect, useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

const FloatingElements = () => {
  const [showChibi, setShowChibi] = useState(false);

  useEffect(() => {
    // Show cute chibi popup randomly
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowChibi(true);
        setTimeout(() => setShowChibi(false), 3000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Random sparkles that appear on scroll */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-primary/30 animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${16 + Math.random() * 16}px`,
              height: `${16 + Math.random() * 16}px`,
            }}
          />
        ))}
      </div>

      {/* Floating stars */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-accent/20 animate-float-slow"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 4}s`,
              width: `${12 + Math.random() * 12}px`,
              height: `${12 + Math.random() * 12}px`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Chibi character popup */}
      {showChibi && (
        <div className="fixed bottom-24 right-24 z-50 animate-scale-in">
          <div className="bg-card/95 backdrop-blur-lg rounded-2xl p-4 shadow-glow border border-primary/20 max-w-xs">
            <div className="flex items-start gap-3">
              <Heart
                className="w-8 h-8 text-primary animate-wiggle shrink-0"
                fill="currentColor"
              />
              <div>
                <p className="font-playfair text-sm font-semibold text-primary-foreground mb-1">
                  I love you so much! 💕
                </p>
                <p className="font-poppins text-xs text-muted-foreground">
                  Just a reminder! You're my cutu baby! 💕
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingElements;
