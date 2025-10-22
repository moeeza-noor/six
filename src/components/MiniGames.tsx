import { useEffect, useMemo, useState } from "react";
import { Gamepad2, Heart, Trophy, Sparkles, Gift, Cookie } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Choice = "Heart" | "Hug" | "Kiss";

type MemoryCard = {
  id: number;
  symbol: string;
  revealed: boolean;
  matched: boolean;
};

const MiniGames = () => {
  const { toast } = useToast();

  // -----------------------------
  // Love Fortune Cookie
  // -----------------------------
  const fortunes = useMemo(
    () => [
      "You’re my favorite notification. ✨",
      "A forehead kiss is on its way. 💋",
      "Next coffee is my treat. ☕💕",
      "Midnight call, no alarms—just us. 🌙",
      "You + me = always, okay? ♾️",
      "Rainy-day cuddle coupon unlocked. 🌧️🤗",
      "Surprise date night loading… ✨",
      "Your smile is my soft place to land. 🧸",
      "I’m proud of you—always. 💻❤️",
      "Six months down, forever to go. 🌸",
      "I love you 3000. 🚀",
      "A long hug is scheduled soon. 🫶",
    ],
    []
  );
  const [lastFortuneIdx, setLastFortuneIdx] = useState<number | null>(null);
  const [cracking, setCracking] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);

  const crackCookie = () => {
    if (cracking) return;
    setCracking(true);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        // @ts-ignore
        navigator.vibrate?.(30);
      } catch {}
    }

    let idx = Math.floor(Math.random() * fortunes.length);
    if (lastFortuneIdx !== null && fortunes.length > 1) {
      while (idx === lastFortuneIdx) idx = Math.floor(Math.random() * fortunes.length);
    }
    setLastFortuneIdx(idx);

    setTimeout(() => {
      const msg = fortunes[idx];
      setFortune(msg);
      setCracking(false);
      toast({ title: "Your love fortune 💘", description: msg });
    }, 900);
  };

  // -----------------------------
  // Love Wheel
  // -----------------------------
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [currentReward, setCurrentReward] = useState<string | null>(null);

  const loveRewards = [
    "1 Forehead Kiss 💋",
    "Movie Night of Your Choice 🎬",
    "Breakfast in Bed 🥞",
    "30 Minute Massage 💆",
    "Your Favorite Dessert 🍰",
    "Surprise Date Night ✨",
    "Compliment Shower 💕",
    "Cuddle Session 🤗",
  ];

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    const randomIndex = Math.floor(Math.random() * loveRewards.length);
    setTimeout(() => {
      const reward = loveRewards[randomIndex];
      setCurrentReward(reward);
      setWheelSpinning(false);
      toast({ title: "You won! 🎉", description: reward });
    }, 2000);
  };

  // -----------------------------
  // Heart–Hug–Kiss (RPS variant)
  // -----------------------------
  const choices: Choice[] = ["Heart", "Hug", "Kiss"];
  const beats: Record<Choice, Choice> = { Heart: "Kiss", Kiss: "Hug", Hug: "Heart" };
  const emojis: Record<Choice, string> = { Heart: "❤️", Hug: "🤗", Kiss: "💋" };

  const [you, setYou] = useState<Choice | null>(null);
  const [ai, setAi] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [yourScore, setYourScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const playHHK = (pick: Choice) => {
    const aiPick = choices[Math.floor(Math.random() * choices.length)];
    setYou(pick);
    setAi(aiPick);

    let res: string;
    if (pick === aiPick) {
      res = "It's a tie! 💞";
    } else if (beats[pick] === aiPick) {
      res = "You win! 🏆";
      setYourScore((s) => s + 1);
    } else {
      res = "Partner wins! 🎉";
      setAiScore((s) => s + 1);
    }
    setResult(res);
    toast({ title: "Heart–Hug–Kiss", description: `${emojis[pick]} vs ${emojis[aiPick]} — ${res}` });
  };

  const resetHHK = () => {
    setYou(null);
    setAi(null);
    setResult(null);
    setYourScore(0);
    setAiScore(0);
  };

  // -----------------------------
  // NEW GAME (replacing Maze): Love Memory Match
  // -----------------------------
  const memorySymbols = useMemo(
    () => ["❤️", "💋", "☕", "🌙", "🧸", "🌸"], // 6 pairs = 12 cards (4x3 grid)
    []
  );

  const buildDeck = (): MemoryCard[] => {
    const doubled = memorySymbols
      .flatMap((s) => [s, s])
      .map((symbol, i) => ({
        id: i + 1,
        symbol,
        revealed: false,
        matched: false,
      }));

    // fisher–yates shuffle
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }
    return doubled;
  };

  const [deck, setDeck] = useState<MemoryCard[]>(() => buildDeck());
  const [flippedIdxs, setFlippedIdxs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [lockBoard, setLockBoard] = useState(false);

  useEffect(() => {
    const b = localStorage.getItem("loveMemoryBest");
    if (b) setBest(Number(b));
  }, []);

  const resetMemory = () => {
    setDeck(buildDeck());
    setFlippedIdxs([]);
    setMoves(0);
    setLockBoard(false);
  };

  const onFlip = (idx: number) => {
    if (lockBoard) return;
    const card = deck[idx];
    if (card.revealed || card.matched) return;

    const nextDeck = deck.slice();
    nextDeck[idx] = { ...card, revealed: true };
    setDeck(nextDeck);
    const nextFlipped = [...flippedIdxs, idx];
    setFlippedIdxs(nextFlipped);

    if (nextFlipped.length === 2) {
      setLockBoard(true);
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      const same = nextDeck[a].symbol === nextDeck[b].symbol;

      setTimeout(() => {
        const updated = nextDeck.slice();
        if (same) {
          updated[a] = { ...updated[a], matched: true };
          updated[b] = { ...updated[b], matched: true };
        } else {
          updated[a] = { ...updated[a], revealed: false };
          updated[b] = { ...updated[b], revealed: false };
        }
        setDeck(updated);
        setFlippedIdxs([]);
        setLockBoard(false);

        // win check
        if (updated.every((c) => c.matched)) {
          const msg = `All pairs matched in ${moves + 1} moves!`;
          toast({ title: "Love Memory Match 💞", description: msg });
          if (best === null || moves + 1 < best) {
            localStorage.setItem("loveMemoryBest", String(moves + 1));
            setBest(moves + 1);
          }
        }
      }, 650);
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
            Love Games & Fun
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Play together, win together, love together ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Love Fortune Cookie */}
          <Card className="animate-scale-in shadow-medium border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-primary" />
                <CardTitle className="font-playfair text-2xl">Love Fortune Cookie</CardTitle>
              </div>
              <CardDescription className="font-poppins">
                Crack the cookie for a sweet surprise message 💌
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-glow 
                    ${cracking ? "animate-[ping_0.6s_ease-in-out_1]" : ""}`}
                >
                  <div className="w-36 h-36 bg-card rounded-full flex items-center justify-center border border-primary/20">
                    <Cookie className={`w-16 h-16 ${cracking ? "animate-bounce" : ""} text-primary`} />
                  </div>
                </div>
              </div>

              <Button
                onClick={crackCookie}
                disabled={cracking}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins"
              >
                {cracking ? "Cracking…" : "Crack the Cookie!"}
              </Button>

              {fortune && !cracking && (
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 animate-scale-in">
                  <Sparkles className="w-7 h-7 mx-auto mb-2 text-primary" />
                  <p className="font-playfair text-base text-primary-foreground">{fortune}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Love Wheel Spinner */}
          <Card
            className="animate-scale-in shadow-medium border-secondary/20"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-secondary" />
                <CardTitle className="font-playfair text-2xl">Love Wheel</CardTitle>
              </div>
              <CardDescription className="font-poppins">
                Spin to win a love coupon!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div
                  className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow ${
                    wheelSpinning ? "animate-spin" : ""
                  }`}
                >
                  <div className="w-40 h-40 bg-card rounded-full flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>

              <Button
                onClick={spinWheel}
                disabled={wheelSpinning}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-poppins"
              >
                {wheelSpinning ? "Spinning..." : "Spin the Wheel!"}
              </Button>

              {currentReward && !wheelSpinning && (
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 animate-scale-in">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-playfair text-lg text-primary-foreground">{currentReward}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Heart–Hug–Kiss */}
          <Card
            className="animate-scale-in shadow-medium border-pink-300/30"
            style={{ animationDelay: "0.15s" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-accent" fill="currentColor" />
                <CardTitle className="font-playfair text-2xl">Heart–Hug–Kiss</CardTitle>
              </div>
              <CardDescription className="font-poppins">
                A cute twist on Rock–Paper–Scissors. First to 5 wins!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {choices.map((c) => (
                  <Button
                    key={c}
                    onClick={() => playHHK(c)}
                    className="font-poppins"
                    variant="secondary"
                    aria-label={`Choose ${c}`}
                  >
                    <span className="mr-2">{emojis[c]}</span>
                    {c}
                  </Button>
                ))}
              </div>

              <div className="rounded-lg border border-accent/30 p-4 bg-accent/10">
                <div className="flex items-center justify-between font-poppins">
                  <span>
                    You: <span className="font-semibold">{you ? `${emojis[you]} ${you}` : "—"}</span>
                  </span>
                  <span>
                    Partner: <span className="font-semibold">{ai ? `${emojis[ai]} ${ai}` : "—"}</span>
                  </span>
                </div>
                {result && <p className="mt-3 text-center font-playfair text-lg">{result}</p>}
                <div className="mt-3 flex items-center justify-center gap-6 font-poppins">
                  <span className="px-3 py-1 rounded bg-card border">You: <b>{yourScore}</b></span>
                  <span className="px-3 py-1 rounded bg-card border">Partner: <b>{aiScore}</b></span>
                </div>
                {(yourScore >= 5 || aiScore >= 5) && (
                  <div className="mt-3 text-center">
                    <p className="font-playfair text-base">
                      {yourScore > aiScore
                        ? "You’re the cuddle champion! 🤗🏆"
                        : "Your partner takes the crown! 👑💞"}
                    </p>
                    <Button onClick={resetHHK} className="mt-2" variant="outline">
                      Reset Match
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* REPLACED PREVIEW WITH: Love Memory Match */}
        <Card className="mt-8 animate-fade-in shadow-medium border-accent/20" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-accent" fill="currentColor" />
              <CardTitle className="font-playfair text-2xl">Love Memory Match</CardTitle>
            </div>
            <CardDescription className="font-poppins">
              Flip two cards to find a pair. Match all pairs in the fewest moves! 💕
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Board */}
              <div className="grid grid-cols-4 gap-3 w-full md:w-auto">
                {deck.map((card, idx) => {
                  const show = card.revealed || card.matched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => onFlip(idx)}
                      disabled={card.revealed || card.matched || lockBoard}
                      className={`w-20 h-24 rounded-2xl border flex items-center justify-center text-3xl
                        transition-transform duration-200 select-none
                        ${show ? "bg-primary/10 border-primary/30" : "bg-card border-muted-foreground/20 hover:scale-[1.03]"}
                        ${card.matched ? "shadow-glow" : ""}`}
                      aria-label={show ? `Card ${card.symbol}` : "Face down card"}
                    >
                      <span className={`transition-opacity ${show ? "opacity-100" : "opacity-0"}`}>
                        {show ? card.symbol : "❥"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar: stats & controls */}
              <div className="flex-1">
                <div className="rounded-lg border p-4 bg-primary/5">
                  <p className="font-poppins">
                    Moves: <span className="font-semibold">{moves}</span>
                  </p>
                  <p className="font-poppins mt-1">
                    Best: <span className="font-semibold">{best ?? "—"}</span>
                  </p>
                  <Button onClick={resetMemory} variant="outline" className="mt-4">
                    Reset Board
                  </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground font-poppins">
                  Tip: Try to beat your best score—pair up fast! ✨
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MiniGames;
