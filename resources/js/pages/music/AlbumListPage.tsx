import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Album } from "@/types/music";
import { Page } from "@inertiajs/core";
import { Link, router, usePage, useRemember } from "@inertiajs/react";
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
  const [scrollY, setScrollY] = useRemember(0, "page-scroll");

  // restore scroll
  useEffect(() => {
    window.scrollTo(0, scrollY);
  }, []);

  // save scroll
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { albums, page } = usePage<{
    albums: Paginated<Album>;
    page: number;
  }>().props;
  const [items, setItems] = useState<Album[]>(albums.data);

  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  const loadMore = () => {
    const params = new URLSearchParams(window.location.search);

    const page =
      Number(params.get("page")) > 0 ? Number(params.get("page")) : 1;

    router.get(
      route("music.album.index"),
      { page: page + 1 },
      {
        preserveState: true,
        preserveScroll: true,
        only: ["albums"],
        onSuccess: (
          page: Page<{ albums?: Paginated<Album>; page?: number }>,
        ) => {
          if (page.props.albums && page.props.page) {
            const newPosts = page.props.albums.data;

            setItems(newPosts);
          }
        },
      },
    );
  };

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && albums.next_page_url) {
        loadMore();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <ContentWrapper>
      <ResponsiveGridWrapper minSize="10rem">
        {items &&
          items.map((album, index) => {
            const isLast = index === items.length - 1;

            return (
              <Link href={route("music.album.show", { album: album.id })}>
                <Card className="p-0 overflow-hidden gap-1 border-none shadow-none rounded-none">
                  <CardHeader className="p-0">
                    <div
                      style={{
                        backgroundColor: album.has_artwork ? "black" : "red",
                        backgroundImage: album.has_artwork
                          ? `url(/music/artwork/${album.id}.${album.artwork_ext})`
                          : "",
                      }}
                      className="w-full aspect-square bg-cover rounded-sm"
                    />
                  </CardHeader>
                  <CardContent className="w-full p-0 h-12">
                    <span className="text-xs">{album.title}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
      </ResponsiveGridWrapper>
      {/* trigger */}
      <div ref={loaderRef} className="h-10" />

      {!albums?.next_page_url && <p className="text-center">No more data</p>}
    </ContentWrapper>
  );
}
