import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaSession } from "@/hooks/use-media-session";
import MasterLayout from "@/layout/master-layout";
import { Track } from "@/types/music";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";

interface IMusicListPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tracks: Track[];
}

export default function MusicListPage(props: IMusicListPageProps) {
  const [currentSong, setCurrentSong] = useState<Track>(props.tracks[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const prevSoundRef = useRef<any>(null);

  const [play, { sound, stop, pause }] = useSound(currentSong.track_path, {
    onend: () => {
      stop();
      setCurrentSong(
        props.tracks[Math.floor(Math.random() * props.tracks.length)],
      );
    },
    id: "main",
    volume: 1,

    interrupt: true,
  });

  function convertSecondsToTimeString(time: number = 0): string {
    const addZero = (num: string) => (num.length > 1 ? num : `0${num}`);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${addZero(String(minutes))}:${addZero(String(seconds))}`;
  }

  useEffect(() => {
    if (!sound) return;
    const interval = setInterval(() => {
      setCurrentTime(sound.seek());
    }, 300);

    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    if (prevSoundRef.current) {
      prevSoundRef.current.stop();
    }

    // Save current sound instance
    if (sound) {
      prevSoundRef.current = sound;
      play();
    }
  }, [currentSong, sound]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (sound) sound.seek(newTime);
    setCurrentTime(newTime);
  };

  useMediaSession({
    title: currentSong.title,
    artwork: currentSong.cover,
    onNext: () => false,
    onPause: () => pause(),
    onPlay: () => play(),
    onPrevious: () => console.log("boom"),
  });
  return (
    <MasterLayout>
      <div className="h-[10rem] w-full flex gap-5 fixed z-10 bg-white p-3 bottom-0">
        <div
          className="h-full w-auto aspect-square bg-center bg-cover cursor-pointer"
          style={{ backgroundImage: `url("${currentSong.cover}")` }}
        />
        <div className="flex flex-col w-full h-full">
          <h1 className="text-lg">{currentSong.title}</h1>
          <p className="text-xs">{currentSong.artist?.name}</p>
          <div className="w-full mt-auto">
            <div className="flex justify-between items-center">
              <p>{convertSecondsToTimeString(currentTime)}</p>
              <p>{convertSecondsToTimeString(sound?.duration())}</p>
            </div>
            <input
              type="range"
              min="0"
              className="w-full"
              max={sound?.duration()}
              // defaultValue={currentTime}
              value={currentTime}
              step="0.1"
              onChange={handleSeek}
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <Button
              onClick={() => {
                console.log(currentSong);
                play();
                sound?.seek(currentTime);
              }}
            >
              Play
            </Button>
            <Button onClick={() => stop()}>Stop</Button>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[80svh]">
        {/* <ContentWrapper> */}
        {props.tracks.map((track) => (
          <div
            className="h-[5rem] w-full bg-center cursor-pointer"
            style={{ backgroundImage: `url("${track.cover}")` }}
            onClick={() => {
              if (sound) stop();
              setCurrentSong(track);
            }}
          >
            <div
              className="w-full h-full flex gap-3"
              style={{
                backdropFilter: "blur(5px)",
                background: "linear-gradient(90deg, black, transparent)",
              }}
            >
              <div
                className="h-full w-auto aspect-square  bg-center bg-cover"
                style={{ backgroundImage: `url("${track.cover}")` }}
              />
              <div className="flex flex-col justify-center text-white">
                <p className="text-xl">{track.title}</p>
                <p className="text-xs">{track.artist?.name}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* </ContentWrapper> */}
    </MasterLayout>
  );
}
