import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import PaginationMain from "@/components/app/PaginationMain";
import PhotoSetItemSquareCard from "@/components/app/PhotoSetItemSquareCard";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MasterLayout from "@/layout/master-layout";
import { Tag } from "@/types";
import { PhotoSetItemInterface } from "@/types/coser";
import { Flex } from "antd";
import { Search } from "lucide-react";
import React from "react";

interface ICoserBrowserPageProps extends React.ComponentPropsWithoutRef<"div"> {
  photo_set_items: {
    data: PhotoSetItemInterface[];
    links: {
      url: string;
      label: string;
      active: boolean;
    }[];
    next_page_url: string;
    prev_page_url: string;
  };
  tags: Tag[];
}

export default function CoserBrowserPage(props: ICoserBrowserPageProps) {
  const params = new URLSearchParams(window.location.search);
  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[{ name: "Cosplay", href: "/cosplay" }]}
          currentPath={"Browse"}
        />
        <Flex justify="space-between" align="center">
          <h1 style={{ fontSize: "2rem" }}>Browse coser images</h1>
        </Flex>
        <form className="flex gap-2 grow-0">
          <Input
            id="search"
            type="text"
            name="search"
            className="w-[50%]"
            defaultValue={params.get("search") ?? ""}
          />
          {/* <Select defaultValue={params.get("tags") ?? ""} name="tags">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">any</SelectItem>
                {props.tags.map((tag) => (
                  <SelectItem value={tag.name}>{tag.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}

          <Button type="submit" color="red">
            Search <Search />
          </Button>
        </form>
        <ResponsiveGridWrapper minSize="15rem" wrapMode="auto-fill">
          {props.photo_set_items.data.map(
            (photo_set_item: PhotoSetItemInterface, index: number) => (
              <PhotoSetItemSquareCard
                key={index}
                photo_set_item={photo_set_item}
                tags={props.tags}
              />
            ),
          )}
        </ResponsiveGridWrapper>
        <PaginationMain
          next_page_url={props.photo_set_items.next_page_url}
          prev_page_url={props.photo_set_items.prev_page_url}
          links={props.photo_set_items.links}
        />
      </ContentWrapper>
    </MasterLayout>
  );
}
