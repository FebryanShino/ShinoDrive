import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { useMusic } from "@/components/music-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import MusicLayout from "@/layouts/app/music-layout";
import { cn } from "@/lib/utils";
import { Album, Artist, Track } from "@/types/music";
import { Link, router } from "@inertiajs/react";

interface IMusicListPageProps extends React.ComponentPropsWithoutRef<"div"> {
  random_tracks: Track[];
  random_albums: Album[];
  random_artists: Artist[];
}

export default function MusicListPage(props: IMusicListPageProps) {
  const isMobile = useIsMobile();
  const { playPlaylist } = useMusic();
  return (
    <MusicLayout>
      <ContentWrapper>
        <Card
          className={cn("shadow-none bg-transparent border-none", "w-full")}
        >
          <CardHeader className="p-0">
            <h1 className="text-white font-bold text-3xl">New</h1>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto h-80 snap-x snap-mandatory scrollbar-hide gap-3">
              {props.random_artists.map(function (artist) {
                const albumThatHasArtwork =
                  artist.albums.filter((album) => album.artwork_ext)[0] ?? [];
                return (
                  <Link
                    key={artist.id}
                    href={route("music.artist.show", { id: artist.id })}
                  >
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
                            backgroundImage: albumThatHasArtwork.artwork_ext
                              ? `url("/music/artwork/${albumThatHasArtwork.id}.${albumThatHasArtwork.artwork_ext}")`
                              : "",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
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
                  key={track.id}
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
                      backgroundImage: track.album?.artwork_ext
                        ? `url("/music/artwork/${track.album?.id}.${track.album?.artwork_ext}")`
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
            <ResponsiveGridWrapper
              minSize={isMobile ? "6rem" : "10rem"}
              gap={isMobile ? "0.3rem" : "1rem"}
            >
              {props.random_albums.map((album) => (
                <Link
                  key={album.id}
                  href={route("music.album.show", { album: album.id })}
                >
                  <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none bg-trasnparent">
                    <CardHeader className="p-0">
                      <div
                        style={{
                          backgroundColor: "black",
                          backgroundImage: album.artwork_ext
                            ? `url("/music/artwork/${album.id}.${album.artwork_ext}")`
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
    </MusicLayout>
  );
}
