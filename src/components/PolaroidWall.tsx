import { useState } from "react";
import { Camera, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Photo {
  id: number;
  caption: string;
  rotation: number;
  src: string; // NEW: image path
  alt?: string; // NEW: accessibility text
}

const PolaroidWall = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // TIP: Replace src values with your real image filenames in /public/images/polaroids/
  const photos: Photo[] = [
    {
      id: 1,
      caption: "Our first date ☕",
      rotation: -3,
      src: "/images/polaroid/date.jpg",
      alt: "First date",
    },
    {
      id: 2,
      caption: "Dua e Khair 🌅",
      rotation: 2,
      src: "/images/polaroid/img1.jpg",
      alt: "Dua e Khair ",
    },
    {
      id: 3,
      caption: "Cutu selfies we take 📸",
      rotation: -2,
      src: "/images/polaroid/img5.jpg",
      alt: "Cutu selfie together",
    },
    {
      id: 4,
      caption: "Random but cute 🌧️",
      rotation: 3,
      src: "/images/polaroid/img3.jpg",
      alt: "Random but cute",
    },
    {
      id: 5,
      caption: "My favorite picture of us 💕",
      rotation: -1,
      src: "/images/polaroid/img2.jpg",
      alt: "My favorite picture of us",
    },
    {
      id: 6,
      caption: "Making memories ✨",
      rotation: 1,
      src: "/images/polaroid/img4.jpg",
      alt: "Collage of our memories",
    },
  ];

  // small helper to fallback if an image fails to load
  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    el.onerror = null;
    el.src = ""; // clear to show placeholder below (via conditional)
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
            Polaroid Memories
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Snapshots of our beautiful moments together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group cursor-pointer animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: `rotate(${photo.rotation}deg)`,
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="bg-card p-4 pb-12 shadow-medium hover:shadow-glow transition-all duration-300 hover:scale-105 hover:rotate-0">
                {/* Photo */}
                <div className="aspect-square rounded-sm mb-3 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  {photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.alt ?? photo.caption}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={onImgError}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <Camera className="w-16 h-16 mx-auto mb-3 text-primary/40" />
                        <p className="font-poppins text-sm text-muted-foreground">
                          Photo #{photo.id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* subtle film grain overlay (optional) */}
                  <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-10" />
                </div>

                {/* Caption */}
                <p className="font-poppins text-center text-sm text-foreground/70">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog
          open={selectedPhoto !== null}
          onOpenChange={() => setSelectedPhoto(null)}
        >
          <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-lg border-primary/20">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedPhoto && (
              <div className="p-6">
                <div className="aspect-square rounded-lg mb-6 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  {selectedPhoto.src ? (
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.alt ?? selectedPhoto.caption}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Camera className="w-24 h-24 mx-auto mb-4 text-primary/40" />
                      <p className="font-playfair text-2xl text-muted-foreground">
                        Memory #{selectedPhoto.id}
                      </p>
                    </div>
                  )}
                </div>

                <p className="font-poppins text-center text-lg text-foreground">
                  {selectedPhoto.caption}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="text-center mt-12">
          <p className="font-poppins text-sm text-muted-foreground italic">
            💡 Tip: Click any photo to enlarge
          </p>
        </div>
      </div>
    </section>
  );
};

export default PolaroidWall;
