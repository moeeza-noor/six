import { useEffect, useMemo, useRef, useState } from "react";
import { Mail, Heart, Send, Download, Clipboard, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type SavedReply = { id: number; text: string; ts: number };

const LS_OPEN = "love.letterbox.open.v1";
const LS_DRAFT = "love.letterbox.draft.v1";
const LS_REPLIES = "love.letterbox.replies.v1";

const LoveLetterbox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replies, setReplies] = useState<SavedReply[]>([]);
  const [typingIdx, setTypingIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const { toast } = useToast();
  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  // The letter content (typewriter will reveal this)
  const letter = useMemo(
    () =>
      [
        "Dear Arshik,",
        "",
        "Six months ago, you walked into my life and everything changed. What started as a simple message became the best decision I’ve ever made.",
        "Every day with you feels like a new dream — full of laughter, comfort, and moments I never want to forget.",
        "",
        "Thank you for being my partner, my best friend, and my favorite person. For the late-night talks, the silly jokes, the warm hugs, and for choosing me, every day. For loving me as I am, and lifting me up every time.",
        "",
        "These six months have been truly beautiful. I can’t wait to see where our story goes next, and I know as long as we’re together, it will be magic.",
        "",
        "Here’s to us, to our memories, and to forever. I love you, Arshik. 💕",
        "",
        "I love you, Arshik. 💕",
        "",
        "With all my love,",
        "Moeeza",
      ].join("\n"),
    []
  );

  // -------------------------------
  // Persistence (open state, draft, replies)
  // -------------------------------
  useEffect(() => {
    try {
      const savedOpen = localStorage.getItem(LS_OPEN);
      const savedDraft = localStorage.getItem(LS_DRAFT);
      const savedReplies = localStorage.getItem(LS_REPLIES);
      if (savedOpen) setIsOpen(savedOpen === "1");
      if (savedDraft) setReplyMessage(savedDraft);
      if (savedReplies) setReplies(JSON.parse(savedReplies));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_OPEN, isOpen ? "1" : "0");
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DRAFT, replyMessage);
    } catch {}
  }, [replyMessage]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_REPLIES, JSON.stringify(replies));
    } catch {}
  }, [replies]);

  // -------------------------------
  // Typewriter effect on open
  // -------------------------------
  useEffect(() => {
    if (!isOpen) return;
    setTypingIdx(0);
    setIsTyping(true);

    const speed = 12; // ms per char (gentle)
    const text = letter;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypingIdx(i);
      if (i >= text.length) {
        setIsTyping(false);
        window.clearInterval(id);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [isOpen, letter]);

  // -------------------------------
  // Confetti hearts (tiny, no deps)
  // -------------------------------
  const burstHearts = () => {
    const container = confettiRef.current;
    if (!container) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = "💖";
      span.style.position = "absolute";
      span.style.left = "50%";
      span.style.top = "50%";
      span.style.transform = "translate(-50%,-50%)";
      span.style.pointerEvents = "none";
      span.style.filter = "drop-shadow(0 4px 10px rgba(236,72,153,0.4))";

      const angle = (Math.PI * 2 * i) / count;
      const dist = 40 + Math.random() * 60;
      const duration = 700 + Math.random() * 500;

      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      span.animate(
        [
          { transform: "translate(-50%,-50%) scale(0.8)", opacity: 0.9 },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.1)`,
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${
              y + 20
            }px)) scale(0.9)`,
            opacity: 0,
          },
        ],
        { duration, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
      );

      container.appendChild(span);
      window.setTimeout(() => span.remove(), duration + 50);
    }
  };

  // -------------------------------
  // Actions
  // -------------------------------
  const handleSendReply = () => {
    const text = replyMessage.trim();
    if (!text) {
      toast({
        title: "Write a little love first 💌",
        description: "Your heart wants a few words on the page.",
      });
      return;
    }
    const entry: SavedReply = { id: Date.now(), text, ts: Date.now() };
    setReplies((prev) => [entry, ...prev]);
    setReplyMessage("");
    setShowReply(false);

    toast({
      title: "Message sent! 💌",
      description: "Your love letter has been delivered to their heart.",
    });
    burstHearts();
  };

  const handleCopy = async () => {
    const text = replyMessage.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: "Ready to paste anywhere ✨" });
    } catch {
      toast({ title: "Copy failed", description: "Try selecting the text and pressing Ctrl/Cmd+C." });
    }
  };

  const handleDownload = () => {
    const text = replyMessage.trim();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "love-reply.txt";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded 💞", description: "Saved as love-reply.txt" });
  };

  const openEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => {
      // after opening, scroll letter into view smoothly
      document.getElementById("love-letter-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  const resealEnvelope = () => {
    setIsOpen(false);
    setShowReply(false);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
            Love Letterbox
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            A special message just for you
          </p>
        </div>

        <div className="relative animate-scale-in">
          {/* Envelope (closed state) */}
          <div
            className={`transition-all duration-700 cursor-pointer ${isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}`}
            onClick={openEnvelope}
            aria-hidden={isOpen}
          >
            <div className="relative mx-auto w-full max-w-md aspect-[3/2] rounded-lg shadow-medium hover:shadow-glow hover:scale-105 transition-all bg-gradient-to-br from-primary to-secondary">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-20 h-20 mx-auto mb-4 text-primary-foreground animate-float-slow" />
                  <p className="font-playfair text-xl text-primary-foreground">Click to open</p>
                </div>
              </div>
              {/* Envelope flap */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-secondary to-accent rounded-t-lg opacity-80" />
              <Heart
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-card animate-pulse-soft"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Letter content (open) */}
          {isOpen && (
            <Card id="love-letter-card" className="animate-scale-in shadow-medium border-primary/20 relative overflow-hidden">
              {/* confetti portal */}
              <div ref={confettiRef} className="pointer-events-none absolute inset-0 z-10" />

              <CardHeader>
                <CardTitle className="font-playfair text-3xl text-center flex items-center justify-center gap-3">
                  <Heart className="w-8 h-8 text-primary" fill="currentColor" />
                  To My Love
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Typewriter text */}
                <div className="font-poppins text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {letter.slice(0, typingIdx)}
                  {isTyping && <span className="inline-block w-3 h-5 align-baseline bg-primary/60 ml-1 animate-pulse-soft" />}
                </div>

                {/* Top actions */}
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <Button variant="outline" onClick={resealEnvelope} className="font-poppins">
                    <Undo2 className="w-4 h-4 mr-2" />
                    Reseal
                  </Button>
                  {!showReply && (
                    <Button
                      onClick={() => {
                        setShowReply(true);
                        setTimeout(() => replyRef.current?.focus(), 50);
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins"
                    >
                      <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                      Reply to this letter
                    </Button>
                  )}
                </div>

                {/* Reply area */}
                {showReply && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <p className="font-playfair text-lg text-center text-primary-foreground">Your Reply</p>
                    <Textarea
                      ref={replyRef}
                      placeholder="Write your heart out..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="min-h-32 font-poppins border-primary/20 focus:border-primary"
                    />
                    <div className="flex flex-wrap gap-3 justify-between">

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowReply(false);
                          }}
                          className="font-poppins"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send with Love
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reply history */}
                {replies.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <p className="font-playfair text-lg mb-3 text-primary-foreground text-center">Saved Replies</p>
                    <ul className="space-y-3 max-h-60 overflow-auto pr-1">
                      {replies.map((r) => (
                        <li key={r.id} className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                          <div className="text-xs text-muted-foreground mb-1">
                            {new Date(r.ts).toLocaleString()}
                          </div>
                          <div className="whitespace-pre-wrap font-poppins text-foreground/90">{r.text}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoveLetterbox;
