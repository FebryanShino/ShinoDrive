import ContentWrapper from "@/components/app/ContentWrapper";
import { useMusic } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import MusicLayout from "@/layouts/app/music-layout";
import { cn } from "@/lib/utils";
import { Album } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { Link } from "@inertiajs/react";
import { DotIcon, EllipsisVerticalIcon, PlayIcon } from "lucide-react";

export default function AlbumDetailPage(props: { album: Album }) {
  const isMobile = useIsMobile();
  const { playPlaylist, currentTrack } = useMusic();
  const discTotal =
    props.album.tracks[props.album.tracks.length - 1].disc_number;
  return (
    <MusicLayout>
      <ContentWrapper>
        <div
          className={cn(
            "flex gap-4",
            !isMobile ? "flex-row h-72 " : "flex-col h-auto",
          )}
        >
          <div
            className="bg-cover h-full aspect-square rounded-lg"
            style={{
              backgroundImage: props.album.id
                ? `url("/music/artwork/${props.album.id}.${props.album.artwork_ext}")`
                : "",
            }}
          />
          <div className="flex flex-col h-full">
            <div className="flex h-full flex-col justify-center">
              <h1 className="text-3xl font-bold text-white">
                {props.album.title}
              </h1>
              <Link
                href={route("music.artist.show", {
                  artist: props.album.artist.id,
                })}
              >
                <h3 className="text-3xl text-red-400">
                  {props.album.artist.name}
                </h3>
              </Link>
              <div className="flex text-gray-200">
                <span className="font-semibold">
                  {props.album.tracks[0].genre.name}
                </span>
                <DotIcon />
                <span className="font-semibold">
                  {props.album.tracks[0].year}
                </span>
              </div>
            </div>
            <Button
              className={cn("w-30 bg-red-500", !isMobile ? "" : "mt-8")}
              onClick={() => playPlaylist(props.album.tracks)}
            >
              <PlayIcon />
              Play All
            </Button>
          </div>
        </div>

        <div className="mt-20">
          {Array(discTotal ?? 1)
            .fill("")
            .map((disc, index) => (
              <div className="mb-10">
                <div className="h-12 text-white flex">
                  <DotIcon />
                  <h2 className="text-md font-bold text-white">
                    Disc {index + 1}
                  </h2>
                </div>
                {props.album.tracks
                  .filter((item) =>
                    discTotal ? item.disc_number === index + 1 : true,
                  )
                  .map((track, index) => (
                    <div
                      className={cn(
                        "w-full h-16 flex items-center cursor-pointer text-white font-light rounded",
                        index % 2 === 0 ? "bg-gray-900" : "bg-transparent",
                        currentTrack?.id === track.id ? "bg-red-400" : "",
                      )}
                      onClick={() =>
                        playPlaylist(
                          props.album.tracks,
                          props.album.tracks.indexOf(track),
                        )
                      }
                    >
                      <div className="h-full aspect-[3/4] flex items-center justify-center">
                        {track.track_number ?? index + 1}
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
            ))}
        </div>
      </ContentWrapper>
    </MusicLayout>
  );
}
