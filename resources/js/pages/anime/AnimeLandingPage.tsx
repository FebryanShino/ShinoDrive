import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimeLayout from "@/layouts/app/anime-layout";
import { AnimeSeries } from "@/types/anime";
import { Link } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";

export default function AnimeLandingPage(props: { animeList: AnimeSeries[] }) {
  const isMobile = useIsMobile();
  return (
    <AnimeLayout>
      <ContentWrapper>
        <div className="flex justify-between">
          <h1 className="mb-10 text-4xl text-white font-bold">Anime List</h1>
          <Link href={route("anime.form.upload")}>
            <Button className="bg-white text-black hover:bg-blue-950 hover:text-white cursor-pointer">
              Upload <PlusIcon />
            </Button>
          </Link>
        </div>
        <ResponsiveGridWrapper minSize={isMobile ? "8rem" : "12rem"}>
          {props.animeList.map((anime) => (
            <Link
              href={route("anime.show", {
                mal_id: anime.mal_id,
              })}
            >
              <div
                className="aspect-[17/24] bg-gray-900 rounded-lg bg-cover text-white flex items-center justify-center p-5 text-center font-bold"
                style={{ backgroundImage: `url("${anime.cover}")` }}
              >
                {!anime.cover && anime.name}
              </div>
            </Link>
          ))}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </AnimeLayout>
  );
}
