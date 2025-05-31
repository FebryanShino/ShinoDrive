import MusicPlayer, { MusicPlayerHandle } from "@/components/app/MusicPlayer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Track } from "@/types/music";
import { PlayIcon } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

interface IMusicListPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tracks: Track[];
}

export default function MusicListPage(props: IMusicListPageProps) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [isMusicPlayerFullscreen, setIsMusicPlayerFullscreen] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(props.tracks);

  //   useMediaSession({
  //     title: currentSong.title,
  //     artwork: currentSong.cover,
  //     onNext: () => false,
  //     onPause: () => pause(),
  //     onPlay: () => play(),
  //     onPrevious: () => console.log("boom"),
  //   });
  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFilteredTracks(
      props.tracks.filter((track) => track.title.toLowerCase().includes(value)),
    );
  }
  return (
    <div
      className={cn(
        "h-[100dvh] pb-32 bg-primary",
        isMusicPlayerFullscreen ? "overflow-hidden" : "overflow-auto",
      )}
    >
      <MusicPlayer
        ref={musicPlayerRef}
        tracks={props.tracks}
        currentTrack={(track) => setCurrentTrack(track)}
        checkFullscreen={(fullscreen) => setIsMusicPlayerFullscreen(fullscreen)}
      />

      <div className=" w-full h-16 bg-black px-3">
        <div
          className="h-full aspect-square bg-center bg-cover"
          style={{
            backgroundImage: 'url("/logo.png")',
          }}
        ></div>
      </div>
      <div className="sticky top-0 w-full h-auto bg-primary z-[100] overflow-x-auto p-3">
        <div className="flex gap-1">
          <Input
            placeholder="Search track"
            onChange={onSearch}
            className="h-12 text-white"
          />
        </div>
      </div>

      {filteredTracks.map((track) => (
        // <WhenVisible data="idk" fallback={<div>Loading</div>}>
        <div
          className="h-[5rem] w-full bg-center cursor-pointer"
          style={{
            backgroundImage: `url("${track.cover}")`,
          }}
          onClick={() => {
            musicPlayerRef.current?.playMusic(track);
            musicPlayerRef.current?.setFullscreen();
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
              className="h-full w-auto aspect-square  bg-center bg-cover flex items-center justify-center relative"
              style={{ backgroundImage: `url("${track.cover}")` }}
            >
              <div
                className={`w-full h-full bg-black absolute isolate -z-0`}
                style={{
                  background:
                    track.id === currentTrack?.id
                      ? "rgba(0,0,0,.8)"
                      : "transparent",
                }}
              />
              {track.id === currentTrack?.id && (
                <PlayIcon color="white" className="z-1" size="50%" />
              )}
            </div>
            <div className="flex flex-col justify-center text-white">
              <p className="text-xl">{track.title}</p>
              <p className="text-xs">{track.artist?.name}</p>
            </div>
          </div>
        </div>
        // </WhenVisible>
      ))}
    </div>
  );
}
