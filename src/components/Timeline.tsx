import { useState } from "react";
import { Heart, Calendar, MapPin, Phone, Coffee, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineEvent {
  id: number;
  icon: React.ReactNode;
  title: string;
  date: string;
  description: string;
  color: string;
}

const Timeline = () => {
  const events: TimelineEvent[] = [
    {
      id: 1,
      icon: <Heart className="w-6 h-6" fill="currentColor" />,
      title: "First Message",
      date: "Day 1",
      description: "The day our story began with a simple 'Hi' that changed everything 💬",
      color: "text-primary",
    },
    {
      id: 2,
      icon: <Phone className="w-6 h-6" />,
      title: "First Call",
      date: "Day 1",
      description: "Hours flew by as we talked until 3 AM, laughing about everything and nothing 📞",
      color: "text-secondary",
    },
    {
      id: 3,
      icon: <Coffee className="w-6 h-6" />,
      title: "First Date",
      date: "Week 5",
      description: "Long drive turned into dinner, dinner into holding hands, hugs and a endless cute memories together ☕",
      color: "text-accent",
    },
    {
      id: 4,
      icon: <Camera className="w-6 h-6" />,
      title: "First Time Our families met",
      date: "Month 4",
      description: "Our families met for the first time, and everything was so cute. 🎒",
      color: "text-primary",
    },
    {
      id: 5,
      icon: <MapPin className="w-6 h-6" />,
      title: "Dua e Khair",
      date: "21st September",
      description: "Things started getting real here. It felt like a failytail 💖",
      color: "text-secondary",
    },
    {
      id: 6,
      icon: <MapPin className="w-6 h-6" />,
      title: "Six Months & Counting",
      date: "Today",
      description: "Half a year of laughter, love, and building our forever together 💖",
      color: "text-secondary",
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
            Our Story Timeline
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Every moment with you is a memory worth keeping forever
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full hidden md:block" />

          {/* Timeline events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col animate-fade-in`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card */}
                <div className="flex-1 w-full md:w-auto">
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-105 ${
                      selectedEvent === event.id ? "ring-2 ring-primary shadow-glow" : ""
                    }`}
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`${event.color}`}>{event.icon}</div>
                        <CardTitle className="font-playfair text-2xl">{event.title}</CardTitle>
                      </div>
                      <CardDescription className="font-poppins text-sm">{event.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-poppins text-foreground/80">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Icon circle (center) */}
                <div className="hidden md:block shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-card shadow-soft border-4 border-background flex items-center justify-center ${event.color}`}>
                    {event.icon}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
