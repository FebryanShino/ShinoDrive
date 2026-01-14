import { useMusic } from "@/components/music-context";
import { useEffect } from "react";

export function useMediaSession() {
  const { currentTrack, playTrack, next, previous, audio } = useMusic();

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!currentTrack) return;

    // Update metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist?.name,
      album: currentTrack.album?.title,
      artwork: [
        {
          src: `/music/artwork/${currentTrack.album_id}.${currentTrack.album?.artwork_ext}`,
          sizes: "512x512",
          type: `image/${currentTrack.album?.artwork_ext}`,
        },
      ],
    });

    // Action handlers
    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => previous());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());

    // Optional: seekbackward / seekforward
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      audio.currentTime = Math.max(
        audio.currentTime - (details.seekOffset ?? 10),
        0,
      );
    });
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      audio.currentTime = Math.min(
        audio.currentTime + (details.seekOffset ?? 10),
        audio.duration,
      );
    });
  }, [currentTrack, audio, next, previous]);
}
