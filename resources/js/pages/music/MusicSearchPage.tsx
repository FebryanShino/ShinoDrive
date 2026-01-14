import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import TrackListItem from "@/components/app/TrackListItem";
import { useMusic } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import MusicLayout from "@/layouts/app/music-layout";
import { Album, Track } from "@/types/music";
import { Link, router, useForm } from "@inertiajs/react";
import { SearchIcon } from "lucide-react";

export default function MusicSearchPage({
  tracks,
  albums,
  keyword,
}: {
  tracks: Track[];
  albums: Album[];
  keyword: string;
}) {
  const isMobile = useIsMobile();
  const { data, setData, get, processing } = useForm({
    q: "",
  });

  const { currentTrack, playPlaylist } = useMusic();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    get(route("music.browse"), {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }
  return (
    <MusicLayout>
      <ContentWrapper>
        <form className="flex gap-1 h-12" onSubmit={submit}>
          <Input
            placeholder="Search track"
            className="h-full text-white"
            onChange={(e) => setData("q", e.target.value)}
            defaultValue={keyword}
          />
          <Button className="h-full aspect-square bg-white text-white hover:bg-white cursor-pointer">
            <SearchIcon color="black" />
          </Button>
        </form>
        <Tabs defaultValue="album" className="mt-3">
          <TabsList className="bg-gray-900">
            <TabsTrigger className="" value="album">
              Album
            </TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="artist">Artist</TabsTrigger>
          </TabsList>
          <TabsContent value="album">
            <ResponsiveGridWrapper
              minSize={isMobile ? "8rem" : "10rem"}
              gap={isMobile ? "0.5rem" : "1rem"}
            >
              {albums.map((album) => (
                <Link
                  href={route("music.album.show", { album: album.id })}
                  key={album.id}
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
          </TabsContent>
          <TabsContent value="track">
            {tracks.map((track, index) => (
              <TrackListItem
                key={track.id}
                track={track}
                iconOnClick={() => playPlaylist(tracks, index)}
                itemOnClick={() =>
                  router.visit(
                    route("music.album.show", { album: track.album_id }),
                  )
                }
              />
            ))}
          </TabsContent>
        </Tabs>
        <div className="h-auto mt-3"></div>
      </ContentWrapper>
    </MusicLayout>
  );
}
