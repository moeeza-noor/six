import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import PolaroidWall from "@/components/PolaroidWall";
import LoveLetterbox from "@/components/LoveLetterbox";
import LoveCounter from "@/components/LoveCounter";
import MiniGames from "@/components/MiniGames";
import VisionBoard from "@/components/VisionBoard";
import DailyQuote from "@/components/DailyQuote";
import MusicPlayer from "@/components/MusicPlayer";
import EasterEgg from "@/components/EasterEgg";
import FloatingElements from "@/components/FloatingElements";
import { Heart } from "lucide-react";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/10 to-secondary/10 font-poppins relative overflow-x-hidden cursor-star">
      {/* Floating decorative elements */}
      <FloatingElements />
      <EasterEgg />
      <MusicPlayer />

      {/* Main content */}
      <Hero />
      
      {/* Daily Love Quote */}
      <div className="max-w-4xl mx-auto px-6 mb-12 animate-fade-in">
        <DailyQuote />
      </div>

      <LoveCounter />
      <Timeline />
      <PolaroidWall />
      <MiniGames />
      <VisionBoard />
      <LoveLetterbox />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-primary/20 mt-20 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Heart className="w-10 h-10 mx-auto text-primary animate-pulse-soft" fill="currentColor" />
          <p className="font-playfair text-2xl text-primary-foreground">
            Six Months of Forever
          </p>
          <p className="font-poppins text-sm text-muted-foreground max-w-2xl mx-auto">
            Built with love, and filled with lots of cute memories. 
            Here's to our beautiful journey together. 💕✨
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-poppins pt-4">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-primary" fill="currentColor" />
            <span>for you</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
