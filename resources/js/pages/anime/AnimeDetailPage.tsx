import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimeLayout from "@/layouts/app/anime-layout";
import { cn } from "@/lib/utils";
import { AnimeSeries, MALAnimeData, MALEpisode } from "@/types/anime";
import { Link } from "@inertiajs/react";
import { DotIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnimeDetailPage(props: { anime: AnimeSeries }) {
  const isMobile = useIsMobile();
  const [malAnimeData, setMalAnimeData] = useState<MALAnimeData>();
  const [malAnimeEpisodeData, setMalAnimeEpisodeData] =
    useState<MALEpisode[]>();

  async function fetchAnimeDataFromMAL() {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${props.anime.mal_id}/full`,
    );

    if (response.ok) {
      const data: { data: MALAnimeData } = await response.json();
      setMalAnimeData(data.data);
    }
  }
  async function fetchEpisodeDataFromMAL() {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${props.anime.mal_id}/episodes`,
    );

    if (response.ok) {
      const data: { data: MALEpisode[] } = await response.json();
      setMalAnimeEpisodeData(data.data);
    }
  }

  useEffect(() => {
    fetchAnimeDataFromMAL();
    fetchEpisodeDataFromMAL();
    // setMalAnimeData(anime_set_data);
    // setMalAnimeEpisodeData(anime_episode_data);
  }, [props.anime]);

  return (
    <AnimeLayout>
      <ContentWrapper>
        <div
          className={cn(
            "w-full flex gap-10",
            isMobile ? "flex-col" : "h-90 flex-row",
          )}
        >
          <div
            className="aspect-[17/24] h-full bg-cover rounded-2xl"
            style={{
              backgroundImage: `url("${malAnimeData?.images.webp.large_image_url}")`,
            }}
          />
          <div className="flex flex-col h-full">
            <div className="flex h-full flex-col justify-center">
              <h1 className="text-4xl font-bold text-white">
                {malAnimeData?.title_japanese}
              </h1>
              <h3 className="text-2xl text-red-400">
                {malAnimeData?.title_english}
              </h3>
              <div className="flex text-gray-200">
                <span className="font-semibold">
                  {malAnimeData?.studios[0].name}
                </span>
                <DotIcon />
                <span className="font-semibold">{malAnimeData?.year}</span>
              </div>
            </div>
            <Link
              href={route("anime.episode.show", {
                mal_id: props.anime.mal_id,
                number: 1,
              })}
            >
              <Button
                className={cn(
                  "w-30 bg-red-500 cursor-pointer hover:bg-white hover:text-red-500",
                  !isMobile ? "" : "mt-8",
                )}
              >
                <PlayIcon />
                Watch
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-zinc-900 shadow-none border-none p-3 pb-10 mt-5">
          <CardHeader className="p-0">
            <CardTitle className="text-light text-gray-300">Synopsis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-white mt-5">
              {malAnimeData ? (
                <p>{malAnimeData.synopsis}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 bg-gray-700 w-full" />
                  <Skeleton className="h-6 bg-gray-700 w-[70%]" />
                  <Skeleton className="h-6 bg-gray-700 w-[80%]" />
                  <Skeleton className="h-6 bg-gray-700 w-[50%]" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-none p-3 mt-5">
          <CardHeader className="p-0">
            <CardTitle className="text-white">Episodes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0">
            {malAnimeEpisodeData &&
              props.anime.episodes.map((episode, index) => (
                <Link
                  href={route("anime.episode.show", {
                    mal_id: props.anime.mal_id,
                    number: episode.number,
                  })}
                >
                  <div className="w-full h-16 flex gap-3 text-white hover:bg-red-950 rounded">
                    <div className="h-full aspect-square flex justify-center items-center rounded ">
                      {episode.number}
                    </div>
                    <div className="h-full flex flex-col justify-center">
                      <h3>{malAnimeEpisodeData[index].title_japanese}</h3>
                      <h6 className="text-xs">
                        {malAnimeEpisodeData[index].title}
                      </h6>
                    </div>
                  </div>
                </Link>
              ))}
          </CardContent>
        </Card>
      </ContentWrapper>
    </AnimeLayout>
  );
}
