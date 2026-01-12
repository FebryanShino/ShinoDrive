import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MasterLayout from "@/layout/master-layout";
import { Tag } from "@/types";
import { CoserInterface, PhotoSetItemInterface } from "@/types/coser";
import { uniqueArrayOfObjects } from "@/utils";
import { Link } from "@inertiajs/react";
import { Flex } from "antd";
import { ImageIcon, PlusIcon, VideoIcon } from "lucide-react";
import React from "react";

interface CoserDetailPageProps extends React.ComponentPropsWithRef<"div"> {
  coser: CoserInterface;
}
export default function CoserDetailPage({ coser }: CoserDetailPageProps) {
  console.log(coser);
  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[
            { name: "Cosplay", href: "/cosplay" },
            { name: "Coser", href: "/cosplay/coser" },
          ]}
          currentPath={coser.name}
        />
        <Flex justify="space-between" align="center">
          <h1 style={{ fontSize: "2rem" }}>{coser.name}</h1>
          <Link href={`${coser.id}/upload`}>
            <Button>
              <PlusIcon />
              Add Photoset
            </Button>
          </Link>
        </Flex>
        <p>{coser.description}</p>
        <ResponsiveGridWrapper minSize="18rem">
          {coser.photo_set &&
            coser.photo_set.map((set) => {
              const coverImage = (
                set.photo_set_item?.filter(
                  (item) =>
                    item.extension != ".mp4" && item.extension != ".mov",
                ) as PhotoSetItemInterface[]
              )[0].id;
              return (
                <Link href={`${coser.id}/${set.id}`}>
                  <div
                    className="w-full bg-cover bg-top text-white"
                    style={{
                      aspectRatio: 3 / 5,
                      backgroundImage: `url("/cosplay/file/${coverImage}")`,
                    }}
                    // cover={
                    //   <AspectRatio
                    //     ratio={16 / 9}
                    //     style={{
                    //       overflow: "hidden",
                    //       borderRadius: ".2rem",
                    //     }}
                    //   >
                    //     {(set.photo_set_item as PhotoSetItemInterface[])
                    //       .length > 0 && (
                    //       <img
                    //         src={cleanUrl(
                    //           (
                    //             set.photo_set_item?.filter(
                    //               (item) =>
                    //                 item.extension != ".mp4" &&
                    //                 item.extension != ".mov",
                    //             ) as PhotoSetItemInterface[]
                    //           )[0].path,
                    //         )}
                    //         alt=""
                    //         style={{ objectFit: "cover" }}
                    //       />
                    //     )}
                    //   </AspectRatio>
                    // }
                  >
                    <div
                      className="w-full h-full flex flex-col justify-end p-4"
                      style={{
                        background: "linear-gradient(0deg, black, transparent)",
                      }}
                    >
                      <CardTitle className="text-lg">{set.name}</CardTitle>
                      <p className="text-xs mt-2 text-gray-300">{coser.name}</p>
                      <div className="w-full h-[20%] flex gap-1 flex-wrap items-start content-start overflow-auto mt-5">
                        {set.tags &&
                          uniqueArrayOfObjects(set.tags, "tag_id")
                            .sort((a, b) => {
                              if ((a.tag as Tag).name < (b.tag as Tag).name)
                                return -1;
                              else return 1;
                            })
                            .map((tag) => (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                              >
                                {tag.tag?.name}
                              </Button>
                            ))}
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center h-[10%]">
                        <div className="flex gap-3">
                          <ImageIcon />
                          <p>
                            {
                              set.photo_set_item?.filter(
                                (item) =>
                                  item.extension != ".mp4" &&
                                  item.extension != ".mov",
                              ).length
                            }{" "}
                            <span>images</span>
                          </p>
                        </div>
                        {/* <Separator orientation="vertical" /> */}
                        <div className="flex gap-3">
                          <VideoIcon />
                          <p>
                            {
                              set.photo_set_item?.filter(
                                (item) =>
                                  item.extension === ".mp4" ||
                                  item.extension === ".mov",
                              ).length
                            }{" "}
                            <span>Videos</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </MasterLayout>
  );
}
