import { cn } from "@/lib/utils";
import { type Track } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { Link, useForm } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowUp,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Repeat1Icon,
  ShuffleIcon,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import useSound from "use-sound";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import LyricsDisplay from "./LyricsDisplay";

export interface MusicPlayerHandle {
  playMusic: (track?: Track) => void;
  pauseMusic: () => void;
  setFullscreen: () => void;
}

interface MusicPlayerProps extends React.ComponentPropsWithoutRef<"div"> {
  tracks: Track[];
  //   onEnd: (currentTrack: Track) => void;
  autoPlay?: boolean;
  currentTrack: (track: Track) => void;
  checkFullscreen: (fullscreen: boolean) => void;
}

const MusicPlayer = React.forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  (props: MusicPlayerProps, ref) => {
    useImperativeHandle(ref, () => ({
      playMusic,
      pauseMusic,
      setFullscreen,
    }));

    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [randomNumberToRepeat, setRandomNumberToRepeat] = useState(0);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [isRepeated, setIsRepeated] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [autoPlay, setAutoPlay] = useState(props.autoPlay as boolean);

    const prevSoundRef = useRef<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const isRepeatedRef = useRef(false);
    const isShuffledRef = useRef(false);

    useEffect(() => {
      isRepeatedRef.current = isRepeated;
    }, [isRepeated]);
    useEffect(() => {
      isShuffledRef.current = isShuffled;
    }, [isShuffled]);

    const [play, { sound, stop, pause }] = useSound(
      currentTrack ? currentTrack.track_path : props.tracks[0].track_path,
      {
        onend: () => {
          stop();
          if (isRepeatedRef.current)
            return setRandomNumberToRepeat(Math.random());

          setCurrentTrack(
            isShuffledRef.current
              ? getRandomTrack()
              : skipTrackTo(currentTrack as Track, 1),
          );
        },
        id: "main",
        volume: 1,
        interrupt: true,
      },
    );

    function playMusic(track?: Track) {
      setAutoPlay(true);
      if (track) return setCurrentTrack(track);
      play();
    }
    function pauseMusic() {
      pause();
    }

    function setFullscreen() {
      setIsFullscreen(true);
    }

    function skipTrackTo(current: Track, value: number) {
      return props.tracks[
        (((props.tracks.indexOf(current) + value) % props.tracks.length) +
          props.tracks.length) %
          props.tracks.length
      ];
    }

    function getRandomTrack() {
      return props.tracks[Math.floor(Math.random() * props.tracks.length)];
    }

    useEffect(() => {
      if (!sound) return;
      const interval = setInterval(() => {
        setCurrentTime(sound.seek());
        setData("timestamp", Math.floor(sound.seek() * 1000));
      }, 300);

      return () => clearInterval(interval);
    }, [sound]);

    useEffect(() => {
      if (prevSoundRef.current) {
        prevSoundRef.current.stop();
      }

      if (sound && currentTrack) {
        prevSoundRef.current = sound;
        props.currentTrack(currentTrack);
        setData("track_id", currentTrack.id);
        if (autoPlay) play();
      }
    }, [currentTrack, sound, randomNumberToRepeat]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      if (sound) sound.seek(newTime);
      setCurrentTime(newTime);
    };

    const handlePlayOrPause = () => {
      if (sound?.playing()) pause();
      else {
        play();
        sound?.seek(currentTime);
      }
    };

    const { data, setData, progress, post } = useForm({
      text: "",
      track_id: currentTrack?.id,
      timestamp: 0,
    });
    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      post(route("lyrics.add"), {
        preserveScroll: true,
        preserveState: true,
      });
    }

    if (currentTrack)
      return (
        <div
          className={cn(
            "flex flex-col fixed w-full z-[999] bottom-0 bg-cover bg-no-repeat bg-center bg-black",
            "text-white",
          )}
          style={{
            transition: "height .3s, flex-direction 1s",
            height: isFullscreen ? "100dvh" : "8rem",
            backgroundImage: isFullscreen ? `url("${currentTrack.cover}")` : "",
            backgroundColor: isFullscreen ? `` : "black",
          }}
        >
          <div
            className="absolute w-full h-full bg-[rgba(0,0,0,.7)] -z-1 isolate "
            hidden={!isFullscreen}
          />

          {/* Small card */}
          <div className=" w-full" hidden={isFullscreen}>
            <div
              onClick={() => {
                props.checkFullscreen(!isFullscreen);
                setIsFullscreen(!isFullscreen);
              }}
              className={cn(
                "w-full h-auto aspect-auto",
                "bg-transparent flex items-center justify-center",
              )}
            >
              <div className="text-white flex items-center py-2 gap-2">
                <ArrowUp size="1rem" color="white" />
                <p className="text-xs">Fullscreen</p>
              </div>
            </div>
            <div className="flex w-full h-full gap-3 items-center px-5">
              <div
                className="h-[4rem] w-auto aspect-square bg-center bg-cover cursor-pointer rounded-full flex items-center justify-center"
                style={{
                  backgroundImage: `url("${currentTrack.cover}")`,
                }}
              ></div>
              <div className="w-full flex flex-col justify-center">
                <h1 className="text-lg">{currentTrack.title}</h1>
                <p className="text-xs">{currentTrack.artist?.name}</p>
              </div>
              <div
                className="h-[4rem] aspect-square w-auto  flex justify-center items-center"
                onClick={handlePlayOrPause}
              >
                {sound?.playing() ? (
                  <PauseIcon size="2rem" color="white" />
                ) : (
                  <PlayIcon size="2rem" color="white" />
                )}
              </div>
            </div>
          </div>

          {/* Fullscreen mode */}
          <div
            hidden={!isFullscreen}
            className={cn("w-full h-full flex gap-5 flex-col justify-end")}
          >
            <div
              className={cn(
                "w-full h-20 flex items-center",
                isFullscreen ? "bg-none" : "bg-black",
              )}
            >
              <div
                onClick={() => {
                  props.checkFullscreen(!isFullscreen);
                  setIsFullscreen(!isFullscreen);
                }}
                className={cn(
                  isFullscreen
                    ? "h-full aspect-square w-auto"
                    : "w-full h-auto aspect-auto",
                  "bg-transparent flex items-center justify-center",
                )}
              >
                <ArrowLeft size="50%" />
              </div>
              <div hidden={!isFullscreen}>
                <h1 className="text-lg">{currentTrack.title}</h1>
                <p className="text-xs">{currentTrack.artist?.name}</p>
              </div>
            </div>

            <LyricsDisplay
              track={
                props.tracks.find(
                  (track) => track.id === currentTrack.id,
                ) as Track
              }
              timestampSecond={currentTime}
            />
            <div className="flex flex-col w-full h-auto px-3">
              <div
                className="w-full mt-3 flex flex-col-reverse"
                hidden={!isFullscreen}
              >
                <div className="flex justify-between items-center">
                  <p>{convertSecondsToTimeString(currentTime)}</p>
                  <p>{convertSecondsToTimeString(sound?.duration())}</p>
                </div>
                <input
                  type="range"
                  min="0"
                  className="w-full"
                  max={sound?.duration()}
                  value={currentTime}
                  step="0.1"
                  onChange={handleSeek}
                />
              </div>
              <div
                hidden={!isFullscreen}
                className="flex justify-center items-center px-5"
              >
                <div
                  className="mr-auto"
                  onClick={() => setIsShuffled(!isShuffled)}
                >
                  <ShuffleIcon color={isShuffled ? "white" : "gray"} />
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={() =>
                    setCurrentTrack((prevTrack) =>
                      isShuffled
                        ? getRandomTrack()
                        : skipTrackTo(prevTrack as Track, -1),
                    )
                  }
                >
                  <SkipBack size="50%" />
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={handlePlayOrPause}
                >
                  {sound?.playing() ? (
                    <PauseIcon size="70%" color="white" />
                  ) : (
                    <PlayIcon size="70%" color="white" />
                  )}
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={() =>
                    setCurrentTrack((prevTrack) =>
                      isShuffled
                        ? getRandomTrack()
                        : skipTrackTo(prevTrack as Track, 1),
                    )
                  }
                >
                  <SkipForward size="50%" />
                </div>
                <div
                  className="ml-auto"
                  onClick={() => setIsRepeated(!isRepeated)}
                >
                  <Repeat1Icon color={isRepeated ? "white" : "gray"} />
                </div>
              </div>
              <div
                hidden={!isFullscreen}
                className="flex justify-between items-center w-full h-20"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" className="mt-3">
                      <PlusIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[20rem] p-3 bg-white z-999">
                    <h4 className="font-medium mb-3">Lyrics</h4>
                    <form
                      className="gap-3 flex flex-col"
                      onSubmit={handleSubmit}
                    >
                      <div className="gap-1 flex flex-col">
                        <Label htmlFor="text">
                          Text (timestamp:{" "}
                          {convertSecondsToTimeString(currentTime)})
                        </Label>
                        <Input
                          name="text"
                          onChange={(e) => setData("text", e.target.value)}
                        />
                      </div>
                      <Button>Add Lyrics</Button>
                    </form>
                  </PopoverContent>
                </Popover>
                <Link href={`track/${currentTrack.id}/lyrics`}>
                  <Button>Lyrics</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
  },
);

export default MusicPlayer;
