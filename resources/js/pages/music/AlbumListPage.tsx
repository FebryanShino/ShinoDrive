import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Album } from "@/types/music";
import { Page } from "@inertiajs/core";
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: PaginationLink[];
}

export default function AlbumListPage() {
  const { items } = usePage<{ items: Paginated<Album> }>().props;

  const [data, setData] = useState(items.data);
  const [nextPage, setNextPage] = useState(items?.next_page_url);

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPage) {
        router.get(
          nextPage,
          {},
          {
            preserveState: true,
            preserveScroll: true,
            only: ["items"],
            onSuccess: (page: Page<{ items?: Paginated<Album> }>) => {
              if (page.props.items) {
                const items = page.props.items;
                setData((prev) => [...prev, ...items.data]);
                setNextPage(items.next_page_url);
              }
            },
          },
        );
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPage]);
  return (
    <ContentWrapper>
      <ResponsiveGridWrapper minSize="10rem">
        {data &&
          data.map((album) => (
            <Link href={route("music.album.show", { album: album.id })}>
              <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none">
                <CardHeader className="p-0">
                  <div
                    style={{
                      backgroundColor: "black",
                      backgroundImage: `url(/music/artwork/${album.id}.png)`,
                    }}
                    className="w-full aspect-square bg-cover rounded-sm"
                  />
                </CardHeader>
                <CardContent className="w-full p-0 h-12">
                  <span className="text-xs">{album.title}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
      </ResponsiveGridWrapper>
      {/* trigger */}
      <div ref={loaderRef} className="h-10" />

      {!nextPage && <p className="text-center">No more data</p>}
    </ContentWrapper>
  );
}
