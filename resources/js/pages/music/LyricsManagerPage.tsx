import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lyric, Track } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { useForm } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import useSound from "use-sound";

interface LyricsManagerPageProps extends ComponentPropsWithoutRef<"div"> {
  track: Track;
}
function LyricComponent(props: {
  lyric: Lyric;
  onPlay: (time: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  }) => void;
  onStop: () => void;
}) {
  const [isPlaying, setisPlaying] = useState(false);
  function convertMilliseconds(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return { minutes, seconds, milliseconds };
  }
  const originalTime = convertMilliseconds(props.lyric.timestamp);

  const [currentTime, setCurrentTime] = useState(originalTime);

  const { data, setData, progress, post } = useForm({
    timestamp: props.lyric.timestamp,
  });

  useEffect(() => {
    setData(
      "timestamp",
      currentTime.minutes * 60000 +
        currentTime.seconds * 1000 +
        currentTime.milliseconds,
    );
  }, [currentTime]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(data);
    post(route("lyrics.update", { id: props.lyric.id }), {
      preserveScroll: true,
      preserveState: true,
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <h5 className="truncate w-full">{props.lyric.text}</h5>
          <h1>{props.lyric.timestamp}</h1>
          <Button
            onClick={() => {
              !isPlaying ? props.onPlay(currentTime) : props.onStop();
              setisPlaying(!isPlaying);
            }}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>
      </CardHeader>
      <CardFooter className="flex gap-1">
        <form className="flex w-80 items-center gap-1" onSubmit={handleSubmit}>
          <Input
            type="text"
            inputMode="numeric"
            className=""
            value={currentTime.minutes}
            onChange={(event) =>
              setCurrentTime({
                ...currentTime,
                minutes:
                  !isNaN(Number(event.target.value)) &&
                  event.target.value.length < 3 &&
                  Number(event.target.value) < 60
                    ? Number(event.target.value)
                    : currentTime.minutes,
              })
            }
          />
          :
          <Input
            type="text"
            className=""
            value={currentTime.seconds}
            onChange={(event) =>
              setCurrentTime({
                ...currentTime,
                seconds:
                  !isNaN(Number(event.target.value)) &&
                  event.target.value.length < 3 &&
                  Number(event.target.value) < 60
                    ? Number(event.target.value)
                    : currentTime.seconds,
              })
            }
          />
          :
          <Input
            type="text"
            className=""
            value={currentTime.milliseconds}
            onChange={(event) =>
              setCurrentTime({
                ...currentTime,
                milliseconds:
                  !isNaN(Number(event.target.value)) &&
                  event.target.value.length < 4 &&
                  Number(event.target.value) < 1000
                    ? Number(event.target.value)
                    : currentTime.milliseconds,
              })
            }
          />
          <Button type="submit">Assign</Button>
        </form>

        <Button onClick={() => setCurrentTime(originalTime)}>Reset</Button>
      </CardFooter>
    </Card>
  );
}

export default function LyricsManagerPage(props: LyricsManagerPageProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [play, { sound, stop, pause }] = useSound(props.track.filepath, {
    id: "main",
    volume: 1,
    interrupt: true,
  });

  const { data, setData, progress, post } = useForm({
    text: "",
    track_id: props.track.id,
    timestamp: 0,
  });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("lyrics.add"), {
      preserveScroll: true,
      preserveState: true,
    });
  }

  useEffect(() => {
    if (!sound) return;
    const interval = setInterval(() => {
      setCurrentTime(sound.seek());
      setData("timestamp", Math.floor(sound.seek() * 1000));
      return () => clearInterval(interval);
    }, 300);
  }, [sound]);
  return (
    <div className="w-full">
      <ContentWrapper>
        <h1>{convertSecondsToTimeString(currentTime)}</h1>
        {props.track.lyrics.map((lyric) => (
          <LyricComponent
            lyric={lyric}
            onPlay={(time) => {
              play();
              sound.seek(
                time.minutes * 60 + time.seconds + time.milliseconds / 1000,
              );
            }}
            onStop={() => pause()}
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className="mt-3">
              <PlusIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[20rem] p-3 bg-white z-999">
            <h4 className="font-medium mb-3">Lyrics</h4>
            <form className="gap-3 flex flex-col" onSubmit={handleSubmit}>
              <div className="gap-1 flex flex-col">
                <Label htmlFor="text">Text</Label>
                <Input
                  name="text"
                  onChange={(e) => setData("text", e.target.value)}
                />
              </div>
              <Button>Add Lyrics</Button>
            </form>
          </PopoverContent>
        </Popover>
      </ContentWrapper>
    </div>
  );
}
