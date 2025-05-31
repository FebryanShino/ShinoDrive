import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import PhotoSetItemImage from "@/components/app/PhotoSetItemImage";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import MasterLayout from "@/layout/master-layout";
import { Tag } from "@/types";
import { PhotoSetInterface, PhotoSetItemInterface } from "@/types/coser";
import { Link, WhenVisible } from "@inertiajs/react";
import { Flex } from "antd";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useMediaQuery } from "react-responsive";

interface CoserPhotoSetDetailPageProps
  extends React.ComponentPropsWithRef<"div"> {
  photo_set: PhotoSetInterface;
  images: PhotoSetItemInterface[];
  tags: Tag[];
}
export default function CoserPhotoSetDetailPage(
  props: CoserPhotoSetDetailPageProps,
) {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  let potraitImages: PhotoSetItemInterface[] = [];
  let landscapeImages: PhotoSetItemInterface[] = [];

  props.images.forEach((image) => {
    if (image.width / image.height >= 1) {
      landscapeImages.push(image);
    } else {
      potraitImages.push(image);
    }
  });
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
          ]}
          currentPath={props.photo_set.name}
        />
        <Flex
          justify="space-between"
          align={isDesktopOrLaptop ? "center" : "start"}
          gap="2rem"
          vertical={!isDesktopOrLaptop}
        >
          <h1 style={{ fontSize: "2rem" }}>{props.photo_set.name}</h1>
          <Link href={`${props.photo_set.id}/upload`}>
            <Button>
              <PlusIcon />
              Add Images or Video
            </Button>
          </Link>
        </Flex>
        <Link href={`${props.photo_set.id}/video`}>
          <Button>Videos</Button>
        </Link>
        <h1>Potrait Image</h1>
        <ResponsiveGridWrapper minSize="20rem">
          {potraitImages &&
            potraitImages.map((item) => (
              <WhenVisible data={item.path} fallback={<div>Loading...</div>}>
                <PhotoSetItemImage photo_set_item={item} tags={props.tags} />
              </WhenVisible>
            ))}
        </ResponsiveGridWrapper>
        <h1>Landscape Image</h1>
        <ResponsiveGridWrapper minSize="20rem">
          {landscapeImages &&
            landscapeImages.map((item) => (
              <WhenVisible data={item.path} fallback={<div>Loading...</div>}>
                <PhotoSetItemImage photo_set_item={item} tags={props.tags} />
              </WhenVisible>
            ))}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </MasterLayout>
  );
}
