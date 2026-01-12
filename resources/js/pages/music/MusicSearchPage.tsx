import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { useAudio } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Track } from "@/types/music";
import { useForm } from "@inertiajs/react";
import { AudioLinesIcon, SearchIcon } from "lucide-react";

export default function MusicSearchPage({ tracks }: { tracks: Track[] }) {
  const { data, setData, get, processing } = useForm({
    q: "",
  });

  const { currentTrack, playPlaylist } = useAudio();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    get(route("music.browse"), {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }
  return (
    <ContentWrapper>
      <form className="flex gap-1" onSubmit={submit}>
        <Input
          placeholder="Search track"
          className="h-12"
          onChange={(e) => setData("q", e.target.value)}
        />
        <Button size="icon">
          <SearchIcon />
        </Button>
      </form>
      <div className="h-auto mt-3">
        <ResponsiveGridWrapper minSize="10rem">
          {tracks.map((track, index) => (
            <Card
              className={cn(
                "aspect-[3/4] w-full flex p-0 overflow-hidden gap-0 rounded-sm",
                track.id === currentTrack?.id ? "bg-gray-500" : "bg-white",
              )}
              onClick={() => playPlaylist(tracks, index)}
            >
              <CardHeader className="p-3">
                <div
                  style={{
                    backgroundImage: `url(/music/artwork/${track.album_id}.png)`,
                  }}
                  className="w-full aspect-square bg-cover"
                >
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      track.id === currentTrack?.id
                        ? "bg-[rgba(0,0,0,.5)]"
                        : "bg-[rgba(0,0,0,0)]",
                    )}
                  >
                    {track.id === currentTrack?.id && (
                      <AudioLinesIcon size="80" className="text-white" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-0 px-1 text-center h-full flex items-center justify-center">
                <span className="text-sm">{track.title}</span>
              </CardContent>
            </Card>
          ))}
        </ResponsiveGridWrapper>
      </div>
    </ContentWrapper>
  );
}
