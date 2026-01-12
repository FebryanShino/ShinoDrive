import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { useAudio } from "@/components/music-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Artist } from "@/types/music";
import { router } from "@inertiajs/react";

export default function ArtistDetailPage({ artist }: { artist: Artist }) {
  const { playPlaylist, currentTrack } = useAudio();
  return (
    <ContentWrapper>
      {artist.name}
      {artist.albums.map((album) => (
        <div></div>
      ))}
      <div className="flex h-64 gap-2">
        <Card className="w-[50%] border-0 shadow-none">
          <CardHeader className="px-0">
            <h1>Latest release</h1>
          </CardHeader>
          <CardContent className="flex h-[80%] w-full p-0 gap-2">
            <img
              src={`/music/artwork/${artist.albums[0].id}.png`}
              alt=""
              className="h-full rounded-2xl"
            />
            <div className="flex justify-center  flex-col text-left text-sm">
              <p>{artist.albums[0].title}</p>
              <p>{artist.albums[0].track_total} songs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-[75%] border-0 shadow-none">
          <CardHeader className="px-0">
            <h1>Top Songs</h1>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-rows-3 grid-flow-col auto-cols-[17rem] overflow-x-auto snap-x w-full snap-mandatory gap-0.5 scrollbar-hide">
              {artist.tracks.map((track, index) => (
                <div
                  className="truncate snap-start h-14 flex p-1 gap-2"
                  onClick={() =>
                    router.visit(
                      route("music.album.show", { album: track.album_id }),
                    )
                  }
                >
                  <img
                    src={`/music/artwork/${track.album_id}.png`}
                    className="h-full aspect-square"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(artist.tracks, index);
                    }}
                  />
                  <div className="w-[60%]">
                    <h3 className="truncate">{track.title}</h3>
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
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="px-0">
          <h1>Albums</h1>
        </CardHeader>
        <CardContent>
          <ResponsiveGridWrapper minSize="10rem">
            {artist.albums.map((album) => (
              <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none">
                <CardHeader className="p-0">
                  <div
                    style={{
                      backgroundColor: "black",
                      backgroundImage: `url(/music/artwork/${album.id}.png)`,
                    }}
                    className="w-full aspect-square bg-cover rounded-sm"
                  />
                </CardHeader>
                <CardContent className="w-full p-0 h-12">
                  <span className="text-xs">{album.title}</span>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGridWrapper>
        </CardContent>
      </Card>
    </ContentWrapper>
  );
}
