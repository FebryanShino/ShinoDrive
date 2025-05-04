import { Tag } from "@/types";
import { PhotoSetItemInterface } from "@/types/coser";
import { cleanUrl } from "@/utils";
import { Image, Skeleton } from "antd";
import { Info } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PhotoSetItemDetailCard from "./PhotoSetItemDetailCard";

interface PhotoSetItemImageProps extends React.ComponentPropsWithRef<"div"> {
  photo_set_item: PhotoSetItemInterface;
  tags: Tag[];
}

export default function PhotoSetItemImage(props: PhotoSetItemImageProps) {
  const [isLoading, setIsLoading] = useState(false);

  function handleLoad() {
    setIsLoading(false);
  }

  return (
    <div
      className={
        "relative w-full h-auto rounded overflow-hidden bg-cover bg-top"
      }
      style={{
        backgroundImage: `url("/${encodeURIComponent(cleanUrl(props.photo_set_item.path))}")`,
        aspectRatio:
          props.photo_set_item.width <= props.photo_set_item.height
            ? 2 / 3
            : 16 / 9,
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="link"
            className="absolute z-1 right-2 top-2 cursor-pointer"
          >
            <Info size="100px" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PhotoSetItemDetailCard
            photo_set_item={props.photo_set_item}
            tags={props.tags}
          />
        </PopoverContent>
      </Popover>
      <Image
        className="opacity-0"
        height="100%"
        width="100%"
        src={cleanUrl(props.photo_set_item.path)}
        onLoad={handleLoad}
      />

      {isLoading && (
        <div className="absolute z-10 bg-gray-100 w-full h-full flex justify-center items-center">
          <Skeleton.Image active />
        </div>
      )}
      {/* <div
        className="absolute z-100  w-full"
        style={{
          aspectRatio: props.width / props.height,
          background: "rgba(0,0,0,.4)",
          pointerEvents: "none",
        }}
      ></div> */}
    </div>
  );
}
