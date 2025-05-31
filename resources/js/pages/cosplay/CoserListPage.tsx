import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import MasterLayout from "@/layout/master-layout";
import { CoserInterface, PhotoSetItemInterface } from "@/types/coser";
import { cleanUrl } from "@/utils";
import { Link } from "@inertiajs/react";
import { Flex } from "antd";
import { ImageIcon, LibraryBig, PlusIcon } from "lucide-react";
import React from "react";

interface HomepageProps extends React.ComponentPropsWithRef<"div"> {
  cosers: {
    data: CoserInterface[];
    links: {
      url: string;
      label: string;
      active: boolean;
    }[];
    next_page_url: string;
    prev_page_url: string;
  };
}

export default function homepage({ cosers }: HomepageProps) {
  return (
    <MasterLayout>
      <ContentWrapper>
        <Flex justify="space-between" align="center">
          <h1 style={{ fontSize: "2rem" }}>Cosers</h1>
          <Link href="upload">
            <Button>
              <PlusIcon />
              Add Coser
            </Button>
          </Link>
        </Flex>
        <ResponsiveGridWrapper minSize="15rem" wrapMode="auto-fill">
          {cosers.data.map((coser) => {
            const image =
              (coser.photo_set_item as PhotoSetItemInterface[])?.length > 0
                ? (coser.photo_set_item as PhotoSetItemInterface[]).filter(
                    (value) =>
                      value.extension === ".jpg" || value.extension === ".png",
                  )[0].path
                : "";
            const imageUrl = encodeURIComponent(cleanUrl(image));
            return (
              //   <WhenVisible
              //     data={coser.id}
              //     fallback={
              //       <Card
              //         className="relative py-0 overflow-hidden rounded-none bg-blue-500"
              //         style={{
              //           aspectRatio: "2/3",
              //         }}
              //       ></Card>
              //     }
              //   >
              <Link href={"coser/" + coser.id}>
                <Card
                  className="relative py-0 overflow-hidden rounded-none"
                  style={{
                    aspectRatio: "2/3",
                    backgroundImage: `url("/${imageUrl}")`,
                  }}
                >
                  <div
                    className="absolute bg-[rgba(255,255,255,.4)] -z-0 w-full h-full m-0 "
                    style={{ backdropFilter: "blur(10px)" }}
                  ></div>
                  <div
                    className={
                      "relative w-full h-auto overflow-hidden aspect-square bg-cover bg-top"
                    }
                    style={{
                      backgroundImage: `url("/${imageUrl}")`,
                    }}
                  />
                  <CardContent className="z-10 flex flex-col w-full h-[30%] justify-between">
                    <div className="">
                      <CardTitle className="">{coser.name}</CardTitle>
                      <p className="text-xs">{coser.translation ?? "-"}</p>
                    </div>
                    <p className="text-sm leading-4 mt-auto">
                      {coser.description}
                    </p>
                  </CardContent>
                  <CardFooter className="block py-2 z-20">
                    <Separator className="bg-black mb-2 text-black" />
                    <div
                      className="flex w-full items-start justify-between text-xs"
                      style={{ fontSize: ".7rem" }}
                    >
                      <Button variant="link">
                        <LibraryBig />
                        {coser.photo_set?.length} Sets
                      </Button>
                      <Button variant="link">
                        <ImageIcon />
                        {coser.photo_set_item?.length} Images
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
              //   </WhenVisible>
            );
          })}
        </ResponsiveGridWrapper>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                style={{ color: "black" }}
                href={cosers.prev_page_url}
              />
            </PaginationItem>
            {cosers.links.map(
              (link) =>
                !isNaN(Number(link.label)) && (
                  <PaginationItem>
                    <PaginationLink
                      href={link.url}
                      isActive={link.active}
                      style={{ color: "black" }}
                    >
                      {link.label}
                    </PaginationLink>
                  </PaginationItem>
                ),
            )}
            <PaginationItem>
              <PaginationNext
                style={{ color: "black" }}
                href={cosers.next_page_url}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ContentWrapper>
    </MasterLayout>
  );
}
