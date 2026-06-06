"use client";

import { useState } from "react";
import Image from "next/image";

interface CoinPhotoProps {
  imageUrl: string | null;
  coinName: string;
  pcgsDetailUrl: string;
}

export default function CoinPhoto({ imageUrl, coinName, pcgsDetailUrl }: CoinPhotoProps) {
  const [imgError, setImgError] = useState(false);

  const showPhoto = imageUrl && !imgError;

  return (
    <a
      href={pcgsDetailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      title={`View ${coinName} on PCGS CoinFacts`}
    >
      <div className="relative aspect-square w-full max-w-[220px] mx-auto rounded-full overflow-hidden border-2 border-border group-hover:border-copper transition-colors duration-300 bg-surface-raised">
        {showPhoto ? (
          <Image
            src={imageUrl}
            alt={`${coinName} — reference photo via PCGS CoinFacts`}
            fill
            className="object-cover"
            unoptimized // hotlinked from PCGS CDN — Next.js image optimization doesn't apply
            onError={() => setImgError(true)}
          />
        ) : (
          /* Graceful placeholder when no PCGS image is available */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted">
            <span className="text-4xl">🪙</span>
            <span className="text-xs text-center px-3 leading-tight">
              Reference photo<br />not available
            </span>
          </div>
        )}

        {/* PCGS attribution overlay on hover */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-xs text-text-secondary font-medium">View on PCGS →</span>
        </div>
      </div>

      {showPhoto && (
        <p className="text-center text-xs text-text-muted mt-2">
          Reference photo via PCGS CoinFacts
        </p>
      )}
    </a>
  );
}
