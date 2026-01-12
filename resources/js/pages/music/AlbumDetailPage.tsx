import ContentWrapper from "@/components/app/ContentWrapper";
import { useAudio } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Album } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon, EllipsisVerticalIcon, PlayIcon } from "lucide-react";

export default function AlbumDetailPage(props: { album: Album }) {
  const { playPlaylist, currentTrack } = useAudio();
  return (
    <ContentWrapper>
      <Link href={route("music.album.index")}>
        <Button variant="link">
          <ArrowLeftIcon />
          Back
        </Button>
      </Link>
      <div className="h-72 flex gap-4">
        <div
          className="bg-cover h-full aspect-square rounded"
          style={{
            backgroundImage: `url(/music/artwork/${props.album.id}.png)`,
          }}
        />
        <div className="flex flex-col h-full">
          <div className="flex h-full flex-col justify-center">
            <h1 className="text-3xl font-bold">{props.album.title}</h1>
            <h3 className="text-3xl text-red-400">{props.album.artist.name}</h3>
            <span className="font-semibold">
              {props.album.tracks[0].genre.name} * {props.album.tracks[0].year}
            </span>
          </div>
          <Button
            className="w-30 bg-red-500"
            onClick={() => playPlaylist(props.album.tracks)}
          >
            <PlayIcon />
            Play All
          </Button>
        </div>
      </div>

      <div className="mt-20">
        {props.album.tracks.map((track, index) => (
          <div
            className={cn(
              "w-full h-16 flex items-center cursor-pointer",
              index % 2 === 0 ? "bg-gray-300" : "bg-transparent",
              currentTrack?.id === track.id ? "bg-red-400" : "",
            )}
            onClick={() => playPlaylist(props.album.tracks, index)}
          >
            <div className="h-full aspect-[3/4] flex items-center justify-center">
              {track.track_number}
            </div>
            {track.title}
            <div className="ml-auto">
              {convertSecondsToTimeString(track.duration)}
            </div>
            <div className="h-full aspect-[3/4] flex items-center justify-center">
              <EllipsisVerticalIcon />
            </div>
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
}
