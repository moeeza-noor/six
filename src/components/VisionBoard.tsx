import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  MapPin,
  Heart,
  Camera,
  Coffee,
  Plane,
  Home,
  Trash2,
  Star as StarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // if you have a cn helper; otherwise remove and inline classes

type IconKey = "Plane" | "Home" | "Camera" | "Coffee" | "Heart" | "MapPin";

type Dream = {
  id: number;
  text: string;
  category: string;
  icon: IconKey;
  favorite?: boolean;
  createdAt: number;
};

const ICONS: Record<IconKey, JSX.Element> = {
  Plane: <Plane className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  MapPin: <MapPin className="w-6 h-6" />,
};

const DEFAULT_SEED: Dream[] = [
  { id: 1, icon: "Plane", text: "Visit Japan together 🌸", category: "Travel", createdAt: Date.now() - 6e7 },
  { id: 2, icon: "Home", text: "Build our own cozy home 🏡", category: "Future", createdAt: Date.now() - 5e7 },
  { id: 3, icon: "Camera", text: "Create a photo album of us 📸", category: "Memories", createdAt: Date.now() - 4e7 },
  { id: 4, icon: "Coffee", text: "Experience everything in life with you ☕", category: "Dreams", createdAt: Date.now() - 3e7 },
  { id: 5, icon: "Heart", text: "Celebrate our 1st anniversary 💕", category: "Milestones", createdAt: Date.now() - 2e7 },
  { id: 6, icon: "MapPin", text: "Road trip across the country 🚗", category: "Adventure", createdAt: Date.now() - 1e7 },
];

const STORAGE_KEY = "visionBoard.v1";

const VisionBoard = () => {
  const { toast } = useToast();

  // --------------------------------
  // State: persisted dreams
  // --------------------------------
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // add form state
  const [newDream, setNewDream] = useState("");
  const [newCategory, setNewCategory] = useState("Dreams");
  const [newIcon, setNewIcon] = useState<IconKey>("Heart");

  // Load/save from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Dream[];
        setDreams(parsed);
      } else {
        setDreams(DEFAULT_SEED);
      }
    } catch {
      setDreams(DEFAULT_SEED);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
    } catch {}
  }, [dreams]);

  // --------------------------------
  // Categories (dynamic + fixed)
  // --------------------------------
  const baseCategories = ["Travel", "Future", "Memories", "Dreams", "Milestones", "Adventure"];
  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(dreams.map((d) => d.category)));
    const merged = Array.from(new Set([...baseCategories, ...dynamic]));
    return ["All", ...merged];
  }, [dreams]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dreams.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [dreams]);

  // Filter & sort (favorites first, then newest)
  const filteredDreams = useMemo(() => {
    const list = selectedCategory === "All" ? dreams : dreams.filter((d) => d.category === selectedCategory);
    return [...list].sort((a, b) => {
      const favDelta = (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
      if (favDelta !== 0) return favDelta;
      return b.createdAt - a.createdAt;
    });
  }, [dreams, selectedCategory]);

  // --------------------------------
  // Actions
  // --------------------------------
  const handleAddDream = () => {
    const text = newDream.trim();
    if (!text) {
      toast({ title: "Add a dream ✨", description: "Write something sweet first!" });
      return;
    }

    // prevent duplicates (case-insensitive)
    const exists = dreams.some((d) => d.text.toLowerCase() === text.toLowerCase());
    if (exists) {
      toast({ title: "Already on the board 💖", description: "This dream is already pinned." });
      return;
    }

    const dream: Dream = {
      id: Date.now(),
      text,
      category: newCategory.trim() || "Dreams",
      icon: newIcon,
      favorite: false,
      createdAt: Date.now(),
    };

    setDreams((prev) => [dream, ...prev]);
    setNewDream("");
    toast({ title: "Dream added! ✨", description: "Let's make this happen together!" });
  };

  const toggleFavorite = (id: number) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d))
    );
  };

  const deleteDream = (id: number) => {
    setDreams((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Removed from board", description: "We can add it back anytime. 💕" });
  };

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
            Our Vision Board
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Dreams we'll chase together, adventures we'll share ✨
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const active = selectedCategory === category;
            const count = category === "All"
              ? dreams.length
              : (categoryCounts[category] || 0);

            return (
              <Button
                key={category}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "font-poppins transition-all",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                )}
              >
                {category}
                <span className="ml-2 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[11px]">
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredDreams.length === 0 && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30 shadow-soft animate-scale-in">
            <CardContent className="py-10 text-center">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary animate-pulse-soft" />
              <p className="font-poppins text-muted-foreground">
                Nothing here yet — add your first dream below! 💫
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dreams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDreams.map((dream, index) => (
            <Card
              key={dream.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-105 border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-primary group-hover:animate-wiggle">
                      {ICONS[dream.icon]}
                    </div>
                    <CardTitle className="font-playfair text-lg">{dream.text}</CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      aria-label={dream.favorite ? "Unfavorite" : "Favorite"}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        dream.favorite
                          ? "text-primary bg-primary/15"
                          : "text-primary/40 hover:text-primary hover:bg-primary/10"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dream.id);
                      }}
                    >
                      <StarIcon className={cn("w-5 h-5", dream.favorite ? "fill-current" : "")} />
                    </button>

                    <button
                      aria-label="Delete dream"
                      className="p-2 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDream(dream.id);
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-poppins rounded-full">
                  {dream.category}
                </span>
                {dream.favorite && (
                  <span className="text-xs text-primary font-poppins">favorited ★</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Dream */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30 shadow-soft animate-scale-in">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-center flex items-center justify-center gap-3">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              Add Your Dream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
              {/* Dream text */}
              <Input
                placeholder="What should we do together? ✨"
                value={newDream}
                onChange={(e) => setNewDream(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDream()}
                className="font-poppins border-primary/20 focus:border-primary"
              />

              {/* Category select (unstyled native for simplicity) */}
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="rounded-md border border-primary/20 bg-background px-3 text-sm font-poppins hover:bg-primary/5 focus:outline-none"
              >
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Custom…">Custom…</option>
              </select>

              {/* Icon select */}
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value as IconKey)}
                className="rounded-md border border-primary/20 bg-background px-3 text-sm font-poppins hover:bg-primary/5 focus:outline-none"
              >
                {Object.keys(ICONS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>

              <Button
                onClick={() => {
                  if (newCategory === "Custom…") {
                    const name = window.prompt("Name your category:");
                    if (name && name.trim()) setNewCategory(name.trim());
                    else return;
                  }
                  handleAddDream();
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground font-poppins mt-4 italic">
              💡 Dream big together — favorites float to the top!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VisionBoard;
