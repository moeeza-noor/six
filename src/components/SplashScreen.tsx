import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-primary-foreground/20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-8 animate-scale-in">
          <Heart className="w-20 h-20 mx-auto text-primary-foreground mb-4 animate-pulse-soft" fill="currentColor" />
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary-foreground mb-2">
            Loading Our Love
          </h1>
          <p className="font-poppins text-primary-foreground/80 text-lg">love.exe starting up... 💞</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 md:w-96 mx-auto bg-primary-foreground/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-primary-foreground to-card rounded-full transition-all duration-300 ease-out shadow-glow"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-poppins text-primary-foreground/70 mt-3 text-sm">{progress}%</p>
      </div>
    </div>
  );
};

export default SplashScreen;
