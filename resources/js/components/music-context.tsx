import { RepeatMode, Track } from "@/types/music";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MusicPlayer from "./app/MusicPlayer";

type AudioContextType = {
  audio: HTMLAudioElement;

  playlist: Track[];
  currentTrack: Track | null;
  queue: Track[];

  playTrack: (track: Track) => Promise<void>;
  playPlaylist: (tracks: Track[], startIndex?: number) => Promise<void>;
  enqueue: (track: Track) => void;

  next: () => void;
  previous: () => void;

  shuffle: () => void;
  repeatMode: RepeatMode;
  toggleRepeat: () => void;

  isPlaying: boolean;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [originalPlaylist, setOriginalPlaylist] = useState<Track[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = playlist[currentIndex] ?? null;

  /* ---------------- audio events ---------------- */
  useEffect(() => {
    const audio = audioRef.current;

    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime),
    );
    audio.addEventListener("loadedmetadata", () =>
      setDuration(audio.duration || 0),
    );
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, repeatMode, queue]);

  /* ---------------- core logic ---------------- */
  const playTrack = async (track: Track) => {
    const index = playlist.findIndex((t) => t.id === track.id);

    if (index === -1) {
      setPlaylist([track]);
      setCurrentIndex(0);
      audioRef.current.src = `/audio/${track.id}`;
    } else {
      setCurrentIndex(index);
      audioRef.current.src = `/audio/${track.id}`;
    }

    await audioRef.current.play();
  };

  const playPlaylist = async (tracks: Track[], startIndex = 0) => {
    if (isShuffled) {
      setPlaylist([...tracks].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    } else {
      setPlaylist(tracks);
    }
    setOriginalPlaylist(tracks);
    setCurrentIndex(startIndex);
    audioRef.current.src = `/audio/${tracks[startIndex].id}`;
    await audioRef.current.play();
  };

  const enqueue = (track: Track) => {
    setQueue((q) => [...q, track]);
  };

  const next = () => {
    if (queue.length > 0) {
      const [nextTrack, ...rest] = queue;
      setQueue(rest);
      playTrack(nextTrack);
      return;
    }

    if (currentIndex + 1 < playlist.length) {
      setCurrentIndex((i) => i + 1);
      audioRef.current.src = `/audio/${playlist[currentIndex + 1].id}`;
      audioRef.current.play();
      return;
    }

    if (repeatMode === "all") {
      setCurrentIndex(0);
      audioRef.current.src = `/audio/${playlist[0].id}`;
      audioRef.current.play();
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      audioRef.current.src = `/audio/${playlist[currentIndex - 1].id}`;
      audioRef.current.play();
    }
  };

  const shuffle = () => {
    if (!isShuffled) {
      const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
      setPlaylist(shuffledPlaylist);
      setCurrentIndex(shuffledPlaylist.indexOf(currentTrack));
    } else {
      setPlaylist(originalPlaylist);
      setCurrentIndex(originalPlaylist.indexOf(currentTrack));
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  };

  const handleEnded = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    next();
  };

  const seek = (time: number) => {
    audioRef.current.currentTime = Math.min(Math.max(time, 0), duration);
  };

  return (
    <AudioContext.Provider
      value={{
        audio: audioRef.current,

        playlist,
        currentTrack,
        queue,

        playTrack,
        playPlaylist,
        enqueue,

        next,
        previous,

        shuffle,
        repeatMode,
        toggleRepeat,

        isPlaying,
        currentTime,
        duration,
        seek,
      }}
    >
      <MusicPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        repeatMode={repeatMode}
        isShuffled={isShuffled}
        currentTime={currentTime}
        duration={duration}
        onRepeat={() => toggleRepeat()}
        onSeek={(time) => seek(time)}
        onShuffle={() => shuffle()}
        onPlayNext={() => {
          console.log(queue);
          next();
        }}
        onPlayBack={() => previous()}
        checkFullscreen={(isFullscreen) => console.log(isFullscreen)}
        onPlayOrPause={() =>
          isPlaying ? audioRef.current.pause() : audioRef.current.play()
        }
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
