import ContentWrapper from "@/components/app/ContentWrapper";
import { useAudio } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Track } from "@/types/music";
import { Link } from "@inertiajs/react";
import { type ChangeEvent, useState } from "react";

interface IMusicListPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tracks: Track[];
}

export default function MusicListPage(props: IMusicListPageProps) {
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [isMusicPlayerFullscreen, setIsMusicPlayerFullscreen] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(props.tracks);

  const MusicContext = useAudio();

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
      props.tracks.filter((track) =>
        String(track.title).toLowerCase().includes(value),
      ),
    );
  }
  const { playTrack, playPlaylist } = useAudio();
  return (
    <div
      className={cn(
        "h-[100dvh] pb-32 bg-primary",
        isMusicPlayerFullscreen ? "overflow-hidden" : "overflow-auto",
      )}
    >
      <div className=" w-full h-16 bg-black px-3">
        <div
          className="h-full aspect-square bg-center bg-cover"
          style={{
            backgroundImage: 'url("/logo.png")',
          }}
        ></div>
      </div>
      <Link href={route("music.browse")}>
        <Button>Search music</Button>
      </Link>
      <div className="sticky top-0 w-full h-auto bg-primary z-[100] overflow-x-auto p-3"></div>
      <ContentWrapper>
        <div className="bg-red-300 w-full h-auto">
          <h1 className="text-white">Title</h1>
          <div className="flex overflow-x-auto">
            <Link href="/anime">
              <Card className="w-[35%] bg-transparent border-none shadow-none">
                <CardHeader className="px-2">
                  <CardTitle>Playlist</CardTitle>
                </CardHeader>
                <CardContent className="w-auto h-full px-2">
                  <div className="w-auto h-full bg-black aspect-video rounded-lg"></div>
                </CardContent>
              </Card>
            </Link>
            <Card className="w-[35%] bg-transparent border-none shadow-none">
              <CardHeader className="px-2">
                <CardTitle>Playlist</CardTitle>
              </CardHeader>
              <CardContent className="w-auto h-full px-2">
                <div className="w-auto h-full bg-black aspect-video rounded-lg"></div>
              </CardContent>
            </Card>
            <Card className="w-[35%] bg-transparent border-none shadow-none">
              <CardHeader className="px-2">
                <CardTitle>Playlist</CardTitle>
              </CardHeader>
              <CardContent className="w-auto h-full px-2">
                <div className="w-auto h-full bg-black aspect-video rounded-lg"></div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full h-auto mt-10">
          <h1 className="text-white">New Songs</h1>
          <div className="grid grid-rows-4 grid-flow-col auto-cols-[24rem] overflow-x-auto snap-x snap-mandatory w-full gap-0.5 scrollbar-hide">
            {props.tracks.map((track, index) => (
              <div
                className="truncate snap-start h-14 flex p-1 gap-2"
                onClick={() => {
                  playPlaylist(props.tracks, index);
                }}
              >
                <img
                  src={`/music/artwork/${track.album_id}.png`}
                  className="h-full aspect-square"
                />
                <div className="w-[60%]">
                  <h3 className="truncate text-white">{track.title}</h3>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artist?.name}
                  </p>
                </div>
                <div className="h-full aspect-square rounded-md ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </ContentWrapper>

      {/* {filteredTracks.map((track) => (
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
      ))} */}
    </div>
  );
}
