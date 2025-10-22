import { useEffect, useState } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DailyQuote = () => {
  const quotes = [
    {
      text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      author: "Maya Angelou",
    },
    {
      text: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn",
    },
    {
      text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.",
      author: "Dr. Seuss",
    },
    {
      text: "I love you not only for what you are, but for what I am when I am with you.",
      author: "Roy Croft",
    },
    {
      text: "Whatever our souls are made of, yours and mine are the same.",
      author: "Emily Brontë",
    },
    {
      text: "I would rather spend one lifetime with you, than face all the ages of this world alone.",
      author: "J.R.R. Tolkien",
    },
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    // Change quote daily based on date
    const today = new Date().getDate();
    setCurrentQuote(today % quotes.length);
  }, []);

  const getNewQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-playfair text-lg md:text-xl text-foreground mb-3 italic leading-relaxed">
              "{quotes[currentQuote].text}"
            </p>
            <p className="font-poppins text-sm text-muted-foreground text-right">
              — {quotes[currentQuote].author}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={getNewQuote}
            className="shrink-0 hover:bg-primary/10"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
