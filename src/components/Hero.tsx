import { Heart, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-primary/40 animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main title */}
        <div className="mb-8 animate-fade-in">
          <Heart className="w-16 h-16 mx-auto mb-6 text-primary animate-float" fill="currentColor" />
          <h1 className="font-playfair text-6xl md:text-8xl font-bold text-primary-foreground mb-4 leading-tight">
            Six Months of Us
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="font-poppins text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A digital scrapbook celebrating all the cute times we've had together 💕
          </p>
        </div>

        {/* Date badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-soft border border-primary/20">
            <p className="font-poppins text-sm text-muted-foreground">Started</p>
            <p className="font-playfair text-xl font-semibold text-primary-foreground">Our Journey</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-soft border border-secondary/20">
            <p className="font-poppins text-sm text-muted-foreground">Milestone</p>
            <p className="font-playfair text-xl font-semibold text-primary-foreground">6 Months 💖</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-soft border border-accent/20">
            <p className="font-poppins text-sm text-muted-foreground">Forever</p>
            <p className="font-playfair text-xl font-semibold text-primary-foreground">To Go ∞</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full mx-auto flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse-soft" />
          </div>
          <p className="font-poppins text-sm text-muted-foreground mt-3">Scroll to explore our story</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
