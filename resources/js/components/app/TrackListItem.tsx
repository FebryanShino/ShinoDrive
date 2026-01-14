import { Track } from "@/types/music";
import { convertSecondsToTimeString } from "@/utils";
import { EllipsisVerticalIcon } from "lucide-react";

interface TrackListItemProps {
  track: Track;
  itemOnClick: () => void;
  iconOnClick: () => void;
}

export default function TrackListItem(props: TrackListItemProps) {
  return (
    <div
      className="truncate snap-start h-16 flex p-1 gap-2 items-center"
      onClick={() => props.itemOnClick()}
    >
      <div
        className="h-full rounded-sm aspect-square bg-cover"
        style={{
          backgroundColor: "black",
          backgroundImage: props.track.album?.artwork_ext
            ? `url("/music/artwork/${props.track.album?.id}.${props.track.album?.artwork_ext}")`
            : "",
        }}
        onClick={(e) => {
          e.stopPropagation();
          props.iconOnClick();
        }}
      />
      <div className="w-[60%] h-full justify-center flex flex-col">
        <h3 className="truncate text-white decoration-white">
          {props.track.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">
          {props.track.artist?.name}
        </p>
      </div>
      <div className="ml-auto text-white text-xs">
        {convertSecondsToTimeString(props.track.duration)}
      </div>
      <div className="h-full aspect-[3/4] flex items-center justify-center text-white">
        <EllipsisVerticalIcon />
      </div>
    </div>
  );
}
