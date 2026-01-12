import { cn } from "@/lib/utils";
import { Lyric, Track } from "@/types/music";
import { useEffect, useRef } from "react";

interface LyricsDisplayProps extends React.ComponentPropsWithoutRef<"div"> {
  track: Track;
  timestampSecond: number;
}

import React from "react";

function LyricText(props: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [props.active]);
  return (
    <p
      ref={ref}
      className={cn(
        props.active
          ? "text-white text-4xl my-6"
          : "text-gray-500 text-2xl my-3",
      )}
    >
      {props.lyric.text}
    </p>
  );
}

export default function LyricsDisplay(props: LyricsDisplayProps) {
  function getClosestLyric(lyrics: Lyric[], timestamp: number) {
    return lyrics.reduce((acc, lyric) =>
      Math.abs(timestamp - lyric.timestamp) <
        Math.abs(timestamp - acc.timestamp) && timestamp >= lyric.timestamp
        ? lyric
        : acc,
    );
  }

  return (
    <div
      className="h-full w-full overflow-y-auto mb-8 px-4"
      style={{ scrollbarColor: "transparent", scrollbarWidth: "none" }}
    >
      {props.track.lyrics &&
        props.track.lyrics.map((lyric) => {
          const isClosestLyric =
            getClosestLyric(props.track.lyrics, props.timestampSecond * 1000)
              .id === lyric.id;
          return <LyricText lyric={lyric} active={isClosestLyric} />;
        })}
    </div>
  );
}
