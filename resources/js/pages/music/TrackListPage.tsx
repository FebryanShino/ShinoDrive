import ContentWrapper from "@/components/app/ContentWrapper";
import TrackListItem from "@/components/app/TrackListItem";
import { useMusic } from "@/components/music-context";
import { Button } from "@/components/ui/button";
import MusicLayout from "@/layouts/app/music-layout";
import { Paginated } from "@/types/laravel";
import { Track } from "@/types/music";
import { Link, router } from "@inertiajs/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function TrackListPage(props: { tracks: Paginated<Track> }) {
  const { playPlaylist } = useMusic();
  return (
    <MusicLayout>
      <ContentWrapper>
        {props.tracks.data.map((track, index) => (
          <TrackListItem
            track={track}
            key={track.id}
            iconOnClick={() => playPlaylist(props.tracks.data, index)}
            itemOnClick={() =>
              router.visit(route("music.album.show", { album: track.album_id }))
            }
          />
        ))}
        <div className="flex items-center justify-center">
          <Link
            href={props.tracks.prev_page_url as string}
            disabled={!props.tracks.prev_page_url}
          >
            <Button variant="default" disabled={!props.tracks.prev_page_url}>
              <ArrowLeftIcon />
            </Button>
          </Link>
          <Button disabled>{props.tracks.current_page}</Button>
          <Link
            href={props.tracks.next_page_url as string}
            disabled={!props.tracks.next_page_url}
          >
            <Button variant="default">
              <ArrowRightIcon />
            </Button>
          </Link>
        </div>
      </ContentWrapper>
    </MusicLayout>
  );
}
