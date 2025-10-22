import { useEffect, useRef, useState } from "react";
import {
  Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

type Track = {
  title: string;
  artist: string;
  mood: string;
  desc: string;
  src: string; // public/ path or imported URL
};

const STORAGE_KEY = "music_player_collapsed";

const MusicPlayer = () => {
  const playlist: Track[] = [
    {
      title: "Kya Sach Ho Tum",
      artist: "Amna Riaz",
      mood: "💕 Romantic",
      desc: "a song that reminds me of you",
      src: "/audio/kya-sach-ho-tum.mp3",
    },
    {
      title: "4U",
      artist: "Maanu",
      mood: "✨ Dreamy",
      desc: "song that reminds us of our first date",
      src: "/audio/maanu-4u.mp3",
    },
    {
      title: "For A Reason",
      artist: "Karan Aujla, Ikky",
      mood: "🌙 Warm",
      desc: "reminds us of dua e khair",
      src: "/audio/for-a-reason.mp3",
    },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<[number]>([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? saved === "true" : false;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => {
      setCurrentSong((i) => (i + 1) % playlist.length);
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  // Load the current track whenever index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = playlist[currentSong];
    audio.src = track.src;
    audio.currentTime = 0;
    audio.volume = isMuted ? 0 : volume[0] / 100;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  // Respond to play/pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume & mute with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume[0] / 100;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleMute = () => setIsMuted((m) => !m);
  const toggleCollapse = () => setIsCollapsed((c) => !c);

  const nextSong = () => setCurrentSong((i) => (i + 1) % playlist.length);
  const prevSong = () => setCurrentSong((i) => (i - 1 + playlist.length) % playlist.length);

  const track = playlist[currentSong];

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-scale-in">
      {/* Minimized pill */}
      {isCollapsed ? (
        <div className="flex items-center gap-2 bg-card/95 backdrop-blur-lg border border-primary/20 rounded-full shadow-glow px-3 py-2 w-[18rem]">
          <Music className="w-4 h-4 text-primary shrink-0" />
          <button
            onClick={togglePlay}
            className="rounded-full p-1 hover:bg-primary/10"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-primary" /> : <Play className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={nextSong}
            className="rounded-full p-1 hover:bg-primary/10"
            aria-label="Next"
            title="Next"
          >
            <SkipForward className="w-4 h-4 text-primary" />
          </button>

          {/* Scrolling title/artist */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="whitespace-nowrap text-xs text-foreground animate-[marquee_10s_linear_infinite]">
              {track.title} — {track.artist} · {track.mood}
            </div>
          </div>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="rounded-full p-1 hover:bg-primary/10"
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Expand */}
          <button
            onClick={toggleCollapse}
            className="rounded-full p-1 hover:bg-primary/10"
            aria-label="Expand"
            title="Expand"
          >
            <ChevronUp className="w-4 h-4 text-foreground" />
          </button>

          {/* marquee keyframes */}
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>
      ) : (
        // Expanded card
        <Card className="w-80 bg-card/95 backdrop-blur-lg shadow-glow border-primary/20">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-5 h-5 text-primary animate-pulse-soft" />
              <div className="flex-1 min-w-0">
                <h4 className="font-playfair text-sm font-semibold text-foreground truncate">
                  {track.title}
                </h4>
                <p className="font-poppins text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </div>
              <span className="text-[11px] font-poppins whitespace-nowrap">{track.mood}</span>

              {/* Collapse button */}
              <Button
                size="icon"
                variant="ghost"
                className="ml-1 shrink-0 hover:bg-primary/10"
                onClick={toggleCollapse}
                aria-label="Minimize"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-[11px] text-muted-foreground font-poppins mb-3 italic">
              {track.desc}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button size="sm" variant="ghost" onClick={prevSong} className="hover:bg-primary/10">
                <SkipBack className="w-5 h-5 text-primary" />
              </Button>
              <Button size="sm" variant="ghost" onClick={togglePlay} className="hover:bg-primary/10">
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-primary" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-primary" fill="currentColor" />
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={nextSong} className="hover:bg-primary/10">
                <SkipForward className="w-5 h-5 text-primary" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="hover:bg-primary/10 p-2"
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </Button>
              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={(v) => setVolume([v[0]])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs font-poppins text-muted-foreground w-10 text-right">
                {isMuted ? 0 : volume[0]}%
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground font-poppins">
              <span>{currentSong + 1} / {playlist.length}</span>
              <span>🎵 tap play (autoplay blocked)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicPlayer;
