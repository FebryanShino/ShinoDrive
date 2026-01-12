import { cn } from "@/lib/utils";
import { RepeatMode, type Track } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { Link, useForm } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowUp,
  EllipsisVerticalIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Repeat1Icon,
  ShuffleIcon,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, { useImperativeHandle, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import LyricsDisplay from "./LyricsDisplay";

export interface MusicPlayerHandle {
  setFullscreen: () => void;
}

interface MusicPlayerProps extends React.ComponentPropsWithoutRef<"div"> {
  track: Track;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  currentTime: number;
  duration: number;
  autoPlay?: boolean;
  onPlayOrPause: () => void;
  onShuffle: () => void;
  onPlayNext: () => void;
  onPlayBack: () => void;
  onSeek: (timestamp: number) => void;
  onRepeat: () => void;
  checkFullscreen?: (fullscreen: boolean) => void;
}

const MusicPlayer = React.forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  (props: MusicPlayerProps, ref) => {
    useImperativeHandle(ref, () => ({
      setFullscreen,
    }));

    const [currentTime, setCurrentTime] = useState(0);
    const [autoPlay, setAutoPlay] = useState(props.autoPlay as boolean);

    const prevSoundRef = useRef<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    function setFullscreen() {
      setIsFullscreen(true);
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      props.onSeek(newTime);
    };

    const { data, setData, progress, post } = useForm({
      text: "",
      track_id: props.track?.id,
      timestamp: 0,
    });
    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      post(route("lyrics.add"), {
        preserveScroll: true,
        preserveState: true,
      });
    }

    if (props.track)
      return (
        <div
          className={cn(
            "flex flex-col fixed w-full z-[999] bottom-0 bg-cover bg-no-repeat bg-center bg-black",
            "text-white",
          )}
          style={{
            transition: "height .3s, flex-direction 1s",
            height: isFullscreen ? "100dvh" : "8rem",
            backgroundImage: isFullscreen
              ? `url("/music/artwork/${props.track.album_id}.png")`
              : "",
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
                  backgroundImage: `url("/music/artwork/${props.track.album_id}.png")`,
                }}
              ></div>
              <div className="w-full flex flex-col justify-center">
                <h1 className="text-lg">{props.track.title}</h1>
                <p className="text-xs">{props.track.artist?.name}</p>
              </div>
              <div
                className="h-[4rem] aspect-square w-auto  flex justify-center items-center"
                onClick={() => props.onPlayOrPause()}
              >
                {props.isPlaying ? (
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
                  // props.checkFullscreen(!isFullscreen);
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
                <h1 className="text-lg">{props.track.title}</h1>
                <p className="text-xs">{props.track.artist?.name}</p>
              </div>
              <Popover>
                <PopoverTrigger className="ml-auto h-full aspect-square cursor-pointer">
                  <div className="ml-auto h-full w-full flex items-center justify-center">
                    <EllipsisVerticalIcon />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="z-[99999999999999999] w-auto p-1">
                  <Link
                    href={route("music.artist.show", {
                      artist: props.track.artist_id,
                    })}
                  >
                    <Button variant="link">
                      <Avatar>
                        <AvatarImage
                          src={`music/artwork/${props.track.album_id}.png`}
                          alt={props.track.artist?.name}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {props.track.artist?.name}
                    </Button>
                  </Link>
                </PopoverContent>
              </Popover>
            </div>

            <LyricsDisplay
              track={props.track}
              timestampSecond={props.currentTime}
            />

            <div className="flex flex-col w-full h-auto px-3">
              <div
                className="w-full mt-3 flex flex-col-reverse"
                hidden={!isFullscreen}
              >
                <div className="flex justify-between items-center">
                  <p>{convertSecondsToTimeString(props.currentTime)}</p>
                  <p>{convertSecondsToTimeString(props.duration)}</p>
                </div>
                <input
                  type="range"
                  min="0"
                  className="w-full"
                  max={props.duration}
                  value={props.currentTime}
                  step="0.1"
                  onChange={handleSeek}
                />
              </div>
              <div
                hidden={!isFullscreen}
                className="flex justify-center items-center px-5"
              >
                <div className="mr-auto" onClick={() => props.onShuffle()}>
                  <ShuffleIcon color={props.isShuffled ? "white" : "gray"} />
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={() => props.onPlayBack()}
                >
                  <SkipBack size="50%" />
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={() => props.onPlayOrPause()}
                >
                  {props.isPlaying ? (
                    <PauseIcon size="70%" color="white" />
                  ) : (
                    <PlayIcon size="70%" color="white" />
                  )}
                </div>
                <div
                  className="w-16 h-auto aspect-square flex  justify-center items-center"
                  onClick={() => props.onPlayNext()}
                >
                  <SkipForward size="50%" />
                </div>
                <div className="ml-auto" onClick={() => props.onRepeat()}>
                  <Repeat1Icon
                    color={props.repeatMode !== "off" ? "white" : "gray"}
                  />
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
                <Link href={`track/${props.track.id}/lyrics`}>
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
