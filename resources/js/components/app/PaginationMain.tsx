import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface IPaginationMainProps extends React.ComponentPropsWithoutRef<"div"> {
  next_page_url: string;
  prev_page_url: string;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
}

export default function PaginationMain(props: IPaginationMainProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            style={{
              color: "black",
              cursor: props.prev_page_url ? "pointer" : "not-allowed",
            }}
            href={props.prev_page_url}
          />
        </PaginationItem>
        {props.links.map(
          (link) =>
            !isNaN(Number(link.label)) && (
              <PaginationItem>
                <PaginationLink
                  href={link.active ? undefined : link.url}
                  isActive={link.active}
                  style={{
                    color: "black",
                    cursor: link.active ? "default" : "pointer",
                  }}
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            ),
        )}
        <PaginationItem>
          <PaginationNext
            style={{
              color: "black",
              cursor: props.next_page_url ? "pointer" : "not-allowed",
            }}
            href={props.next_page_url}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
