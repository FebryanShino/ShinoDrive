import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { useAudio } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Album, Artist, Track } from "@/types/music";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

interface IMusicListPageProps extends React.ComponentPropsWithoutRef<"div"> {
  random_tracks: Track[];
  random_albums: Album[];
  random_artists: Artist[];
}

export default function MusicListPage(props: IMusicListPageProps) {
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [isMusicPlayerFullscreen, setIsMusicPlayerFullscreen] = useState(false);

  const MusicContext = useAudio();

  //   useMediaSession({
  //     title: currentSong.title,
  //     artwork: currentSong.cover,
  //     onNext: () => false,
  //     onPause: () => pause(),
  //     onPlay: () => play(),
  //     onPrevious: () => console.log("boom"),
  //   });

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
        <Card
          className={cn("shadow-none bg-transparent border-none", "w-full")}
        >
          <CardHeader className="p-0">
            <h1 className="text-white font-bold text-3xl">New</h1>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto h-80 snap-x snap-mandatory scrollbar-hide gap-3">
              {props.random_artists.map((artist) => (
                <Link href={route("music.artist.show", { id: artist.id })}>
                  <Card className="w-auto h-full bg-transparent border-none shadow-none snap-start">
                    <CardHeader className="p-0">
                      <CardTitle>
                        <h1 className="text-gray-100 font-light w-60 truncate">
                          {artist.name}
                        </h1>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="w-auto h-[70%] p-0">
                      <div
                        className="w-auto h-full aspect-video rounded-lg bg-cover bg-top"
                        style={{
                          backgroundColor: "black",
                          backgroundImage: artist.albums[0]?.has_artwork
                            ? `url(/music/artwork/${artist.albums[0].id}.${artist.albums[0].artwork_ext})`
                            : "",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn("shadow-none bg-transparent border-none", "w-full")}
        >
          <CardHeader className="p-0">
            <h1 className="text-white font-bold text-xl">Latest Songs</h1>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-rows-4 grid-flow-col auto-cols-[24rem] overflow-x-auto snap-x snap-mandatory w-full gap-0.5 scrollbar-hide">
              {props.random_tracks.map((track, index) => (
                <div
                  className="truncate snap-start h-14 flex p-1 gap-2"
                  onClick={() =>
                    router.visit(
                      route("music.album.show", { album: track.album_id }),
                    )
                  }
                >
                  <div
                    className="h-full rounded-sm aspect-square bg-cover"
                    style={{
                      backgroundColor: "black",
                      backgroundImage: track.album?.has_artwork
                        ? `url(/music/artwork/${track.album?.id}.${track.album?.artwork_ext})`
                        : "",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(props.random_tracks, index);
                    }}
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
          </CardContent>
        </Card>
        <Card className="w-full px-3 shadow-none border-none bg-transparent mt-3">
          <CardHeader className="p-0">
            <h1 className="text-white font-bold text-xl">Albums</h1>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveGridWrapper minSize="10rem" gap="1rem">
              {props.random_albums.map((album) => (
                <Link href={route("music.album.show", { album: album.id })}>
                  <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none bg-trasnparent">
                    <CardHeader className="p-0">
                      <div
                        style={{
                          backgroundColor: "black",
                          backgroundImage: album.has_artwork
                            ? `url(/music/artwork/${album.id}.${album.artwork_ext})`
                            : "",
                        }}
                        className="w-full aspect-square bg-cover rounded-sm"
                      />
                    </CardHeader>
                    <CardContent className="w-full p-0 h-12">
                      <span className="text-xs text-white">{album.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ResponsiveGridWrapper>
          </CardContent>
        </Card>
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
