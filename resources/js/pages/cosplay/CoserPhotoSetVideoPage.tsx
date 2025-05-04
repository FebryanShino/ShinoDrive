import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import MasterLayout from "@/layout/master-layout";
import { PhotoSetInterface, PhotoSetItemInterface } from "@/types/coser";
import { cleanUrl } from "@/utils";
import React from "react";

interface ICoserPhotoSetVideoPageProps
  extends React.ComponentPropsWithRef<"div"> {
  photo_set: PhotoSetInterface;
  videos: PhotoSetItemInterface[];
}

export default function CoserPhotoSetVideoPage(
  props: ICoserPhotoSetVideoPageProps,
) {
  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[
            { name: "Cosplay", href: "/cosplay" },
            { name: "Coser", href: "/cosplay/coser" },
            {
              name: props.photo_set.coser.name,
              href: "/cosplay/coser/" + props.photo_set.coser.id,
            },
            {
              name: props.photo_set.name,
              href: `/cosplay/coser/${props.photo_set.coser.id}/${props.photo_set.id}`,
            },
          ]}
          currentPath="Video"
        />
        <h1>Videos</h1>
        <ResponsiveGridWrapper minSize="20rem">
          {props.videos &&
            props.videos.map((video) => (
              <video width="400" controls>
                <source src={cleanUrl(video.path)} type="" />
              </video>
            ))}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </MasterLayout>
  );
}
