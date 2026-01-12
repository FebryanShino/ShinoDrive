import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import MasterLayout from "@/layout/master-layout";
import { CoserInterface, PhotoSetItemInterface } from "@/types/coser";
import React from "react";

interface CoserLandingPageProps extends React.ComponentPropsWithRef<"div"> {
  randomImages: PhotoSetItemInterface[] | null;
  topCosers: CoserInterface[];
}

export default function CoserLandingPage({
  randomImages,
  topCosers,
}: CoserLandingPageProps) {
  return (
    <MasterLayout>
      <ContentWrapper>
        <h1 style={{ fontSize: "3rem" }} className="text-center">
          Cosplay Set
        </h1>
        <h1>Random Images</h1>
        <ResponsiveGridWrapper minSize="15rem" wrapMode="auto-fill">
          {randomImages &&
            randomImages.map((item) => (
              <a href={`/cosplay/coser/${item.coser_id}/${item.photo_set_id}`}>
                <div
                  style={{
                    backgroundImage: `url("/cosplay/file/${item.id}")`,
                  }}
                  className="aspect-square w-full h-full overflow-hidden relative bg-cover bg-top"
                >
                  <div
                    className="w-full h-full flex flex-col p-3 justify-end"
                    style={{
                      background: "linear-gradient(180deg, transparent, black)",
                    }}
                  >
                    <p className="leading-5 [&:not(:first-child)]:mt-6 text-white">
                      {item.photo_set.name}
                    </p>
                    <p className="leading-5 [&:not(:first-child)]:mt-2 text-gray-500 text-sm">
                      {item.coser?.name}
                    </p>
                  </div>
                </div>
              </a>
            ))}
        </ResponsiveGridWrapper>
        <div className="mt-[5rem] flex h-[5rem] w-full justify-between border-t-[.1rem] py-4">
          <h1>Top Cosers</h1>
          <a href="cosplay/coser">
            <Button>Show More</Button>
          </a>
        </div>
        <div className="flex scroll-x-auto gap-3 h-auto flex-wrap">
          {topCosers &&
            topCosers.map((coser) => (
              <a
                href={"cosplay/coser/" + coser.id}
                className="no-underline w-[15rem] h-auto"
              >
                <div
                  className="overflow-hidden w-full aspect-square rounded-full bg-cover bg-top"
                  style={{
                    backgroundImage: `url("/cosplay/file/${
                      (
                        coser.photo_set_item?.filter(
                          (item) => item.width != -1,
                        ) as PhotoSetItemInterface[]
                      )[0].id
                    }")`,
                  }}
                ></div>
                <div className="text-center text-black w-full block mt-3">
                  <h4>{coser.name}</h4>
                  <p style={{ fontSize: ".8rem" }} className="text-gray-500">
                    {coser.photo_set_item_count} images
                  </p>
                </div>
              </a>
            ))}
        </div>
      </ContentWrapper>
    </MasterLayout>
  );
}
