import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { useMusic } from "@/components/music-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Artist } from "@/types/music";
import { Link, router } from "@inertiajs/react";
import { useMediaQuery } from "react-responsive";

export default function ArtistDetailPage({ artist }: { artist: Artist }) {
  const { playPlaylist, currentTrack } = useMusic();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return (
    <div className="bg-primary">
      <ContentWrapper>
        <div className="w-full h-64 bg-black flex flex-col items-center justify-center gap-3 rounded">
          <div
            className="h-[40%] aspect-square bg-red-400 rounded-full bg-cover"
            style={{
              backgroundImage: artist.albums[0]?.id
                ? `url("/music/artwork/${artist.albums[0].id}.${artist.albums[0].artwork_ext}")`
                : "",
            }}
          />
          <h1 className="font-bold text-4xl text-white">{artist.name}</h1>
        </div>

        <div
          className={cn(
            "flex gap-3 mt-3",
            isDesktopOrLaptop ? "flex-row h-64" : "flex-col h-auto",
          )}
        >
          <Card
            className={cn(
              " shadow-none px-3 bg-gray-800 border-none",
              isDesktopOrLaptop ? "w-[50%]" : "w-full h-auto",
            )}
          >
            <CardHeader className="p-0 text-white font-bold text-xl">
              <h1>Latest release</h1>
            </CardHeader>
            <CardContent
              className={cn(
                "flex w-full p-0 gap-2 mt-auto",
                isDesktopOrLaptop ? "flex-row h-[70%]" : "flex-col h-auto",
              )}
            >
              <div
                className={cn(
                  "rounded-2xl aspect-square bg-cover",
                  isDesktopOrLaptop ? "h-full" : "w-full",
                )}
                style={{
                  backgroundColor: "black",
                  backgroundImage: artist.albums[0]?.id
                    ? `url("/music/artwork/${artist.albums[0].id}.${artist.albums[0].artwork_ext}")`
                    : "",
                }}
              />
              <div className="flex justify-center flex-col text-left text-sm  font-bold">
                <p className="text-white">{artist.albums[0]?.title}</p>
                <p className="text-gray-400">
                  {artist.albums[0]?.tracks_count} songs
                </p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "shadow-none border-none px-3 bg-gray-900",
              isDesktopOrLaptop ? "w-[75%]" : "w-full",
            )}
          >
            <CardHeader className="p-0">
              <h1 className="text-xl text-white font-bold">Top Songs</h1>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-rows-3 grid-flow-col auto-cols-[17rem] overflow-x-auto snap-x w-full snap-mandatory gap-0.5 scrollbar-hide">
                {artist.tracks.map((track, index) => (
                  <div
                    className="truncate snap-start h-14 flex p-1 gap-2"
                    key={track.id}
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
                        backgroundImage: artist.albums[0]?.id
                          ? `url("/music/artwork/${track.album?.id}.${track.album?.artwork_ext}")`
                          : "",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        playPlaylist(artist.tracks, index);
                      }}
                    />
                    <div className="w-[60%]">
                      <h3 className="truncate text-white">{track.title}</h3>
                      <p className="text-xs text-gray-400 truncate">
                        {artist.name}
                      </p>
                    </div>
                    <div className="h-full aspect-square rounded-md ml-auto"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full px-3 shadow-none mt-3 bg-gray-900 border-none">
          <CardHeader className="p-0">
            <h1 className="text-xl text-white font-bold">Albums</h1>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveGridWrapper minSize="10rem" gap="1rem">
              {artist.albums.map((album) => (
                <Link href={route("music.album.show", { album: album.id })}>
                  <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none bg-transparent">
                    <CardHeader className="p-0">
                      <div
                        style={{
                          backgroundColor: "black",
                          backgroundImage: album.id
                            ? `url("/music/artwork/${album.id}.${album.artwork_ext}")`
                            : "",
                        }}
                        className="w-full aspect-square bg-cover rounded-sm"
                      />
                    </CardHeader>
                    <CardContent className="w-full p-0 h-12">
                      <span className="text-xs font-semibold text-white">
                        {album.title}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ResponsiveGridWrapper>
          </CardContent>
        </Card>
      </ContentWrapper>
    </div>
  );
}
