import { useEffect, useState } from "react";
import { Heart, Clock } from "lucide-react";

const LoveCounter = () => {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set your relationship start date here (6 months ago from now as placeholder)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const updateCounter = () => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-medium border border-primary/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary animate-pulse-soft" fill="currentColor" />
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary-foreground text-center">
              We've Been Together For...
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-1">{timeTogether.days}</p>
              <p className="font-poppins text-sm text-muted-foreground">Days</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
              <Clock className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <p className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-1">{timeTogether.hours}</p>
              <p className="font-poppins text-sm text-muted-foreground">Hours</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
              <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-1">{timeTogether.minutes}</p>
              <p className="font-poppins text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary-glow" />
              <p className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-1">{timeTogether.seconds}</p>
              <p className="font-poppins text-sm text-muted-foreground">Seconds</p>
            </div>
          </div>

          <p className="font-poppins text-center text-muted-foreground mt-6 italic">
            "And every second with you has been worth it" ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoveCounter;
