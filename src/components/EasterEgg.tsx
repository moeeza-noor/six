import { useState } from "react";
import { Heart, Sparkles, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EasterEgg = () => {
  const [found, setFound] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDiscover = () => {
    if (!found) {
      setFound(true);
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Hidden trigger - 6th heart somewhere on page */}
      <div
        className="fixed bottom-32 left-8 cursor-pointer group animate-float z-30"
        onClick={handleDiscover}
        title="Something special is hidden here... ✨"
      >
        <Heart
          className={`w-8 h-8 transition-all duration-300 ${
            found 
              ? "text-primary animate-pulse-soft" 
              : "text-primary/30 group-hover:text-primary group-hover:scale-125"
          }`}
          fill={found ? "currentColor" : "none"}
        />
        {!found && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground/80 text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Click me! 💕
          </div>
        )}
      </div>

      {/* Easter Egg Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-lg border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-3xl text-center flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 text-primary animate-wiggle" />
              You Found It!
              <Sparkles className="w-8 h-8 text-secondary animate-sparkle" />
            </DialogTitle>
          </DialogHeader>

          <div className="py-8 px-6 text-center space-y-6">
            <div className="relative">
              <Heart
                className="w-32 h-32 mx-auto text-primary animate-pulse-soft"
                fill="currentColor"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-playfair text-4xl text-card">6</p>
              </div>
            </div>

            <div className="space-y-4 font-poppins text-foreground/90 leading-relaxed">
              <p className="text-xl font-playfair italic">
                "Six months down, forever to go..."
              </p>
              
              <p>
                You found the secret heart! Just like how you found your way into my life and made everything brighter by just being in it. 
              </p>

              <p>
                These six months have been filled with more joy, laughter, and love than I ever imagined possible. 
                Every moment with you is a treasure, every day an adventure.
              </p>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 mt-6">
                <p className="font-playfair text-2xl text-primary mb-3">
                  Here's to our forever ∞
                </p>
                <p className="text-sm text-muted-foreground">
                  Thank you Arshik for being who you are, for choosing us, for making every day feel like a beautiful dream. 
                  I can't wait to see what our next chapter holds! 💕✨
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-poppins"
            >
              <Heart className="w-4 h-4 mr-2" fill="currentColor" />
              Close (with love)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EasterEgg;
