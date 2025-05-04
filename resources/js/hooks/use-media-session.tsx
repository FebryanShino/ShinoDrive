import { useEffect } from "react";

export interface MediaSessionConfig {
  title: string;
  artist?: string;
  album?: string;
  artwork: string;

  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
}

export function useMediaSession({
  title,
  artist,
  album,
  artwork,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: MediaSessionConfig) {
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title,
        artist,
        album,
        artwork: [{ src: artwork, sizes: "512x512", type: "image/png" }],
      });

      navigator.mediaSession.setActionHandler("play", onPlay);
      navigator.mediaSession.setActionHandler("pause", onPause);
      navigator.mediaSession.setActionHandler("nexttrack", onNext);
      navigator.mediaSession.setActionHandler("previoustrack", onPrevious);
    }
  }, [title, artist, album, artwork, onPlay, onPause, onNext, onPrevious]);
}
