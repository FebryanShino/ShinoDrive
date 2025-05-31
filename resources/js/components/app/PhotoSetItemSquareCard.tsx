import { Tag } from "@/types";
import { PhotoSetItemInterface } from "@/types/coser";
import { Image, Skeleton } from "antd";
import { ExternalLink, Info } from "lucide-react";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cleanUrl } from "@/utils";
import { Link } from "@inertiajs/react";
import { Button } from "../ui/button";
import PhotoSetItemDetailCard from "./PhotoSetItemDetailCard";

interface IPhotoSetItemSquareCardProps
  extends React.ComponentPropsWithRef<"div"> {
  photo_set_item: PhotoSetItemInterface;
  tags: Tag[];
}

export default function PhotoSetItemSquareCard(
  props: IPhotoSetItemSquareCardProps,
) {
  const [isLoading, setIsLoading] = useState(true);

  function handleLoad() {
    setIsLoading(false);
  }

  return (
    <div
      className={
        "relative w-full h-full rounded overflow-hidden aspect-square bg-cover bg-top"
      }
      style={{
        backgroundImage: `url("/${encodeURIComponent(cleanUrl(props.photo_set_item.path))}")`,
        // backgroundImage: `url("${props.photo_set_item.compressed}")`,
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Info
            className="absolute z-20 right-2 top-2 cursor-pointer"
            size={19}
            color="hsl(0,0%,100%)"
          />
          {/* <Button
            size="icon"
            variant="link"
            className="absolute z-20 right-2 top-2 cursor-pointer"
          ></Button> */}
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PhotoSetItemDetailCard
            photo_set_item={props.photo_set_item}
            tags={props.tags}
          >
            <Link
              href={`coser/${props.photo_set_item.coser_id}/${props.photo_set_item.photo_set_id}`}
            >
              <Button variant="link">
                Open Photo Set <ExternalLink />
              </Button>
            </Link>
          </PhotoSetItemDetailCard>
        </PopoverContent>
      </Popover>

      {isLoading && (
        <div className="absolute z-30 bg-gray-100 w-full h-auto flex justify-center items-center aspect-square">
          <Skeleton.Image active />
        </div>
      )}
      <div
        className="absolute z-10  w-full aspect-square"
        style={{
          background: "radial-gradient(transparent, rgba(0,0,0,.5))",
          pointerEvents: "none",
        }}
      ></div>
      <Image
        src={cleanUrl(props.photo_set_item.path)}
        // src={cleanUrl(props.photo_set_item.compressed as string)}
        className="opacity-0 aspect-square"
        onLoad={handleLoad}
      />
    </div>
  );
}
