import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimeLayout from "@/layouts/app/anime-layout";
import { cn } from "@/lib/utils";
import { AnimeEpisode, MALEpisode } from "@/types/anime";
import { Link, router } from "@inertiajs/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnimeEpisodeDetailPage(props: {
  episode: AnimeEpisode;
}) {
  const [malAnimeEpisodeData, setMalAnimeEpisodeData] = useState<MALEpisode>();
  async function fetchEpisodeDataFromMAL() {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${props.episode.series.mal_id}/episodes/${props.episode.number}`,
    );

    if (response.ok) {
      const data: { data: MALEpisode } = await response.json();
      setMalAnimeEpisodeData(data.data);
    }
  }

  useEffect(() => {
    fetchEpisodeDataFromMAL();
  }, []);
  return (
    <AnimeLayout>
      <ContentWrapper>
        <Link
          href={route("anime.show", {
            mal_id: props.episode.series.mal_id,
          })}
        >
          <Button variant="link" className="text-white text-lg">
            <ArrowLeftIcon size={100} />
            Back
          </Button>
        </Link>
        <video controls className="w-full rounded-2xl mt-5">
          <source
            src={route("anime.episode.file", {
              filename: props.episode.id + "." + props.episode.file_extension,
            })}
            type={"video/" + props.episode.file_extension.toLowerCase()}
          />
          Your browser does not support the video tag.
        </video>
        <div className="mt-3 flex justify-between">
          <Button
            disabled={props.episode.number - 1 < 1}
            className="bg-white text-black hover:text-white cursor-pointer"
            onClick={() =>
              router.visit(
                route("anime.episode.show", {
                  mal_id: props.episode.series.mal_id,
                  number: props.episode.number - 1,
                }),
              )
            }
          >
            <ArrowLeftIcon />
            Previous Episode
          </Button>

          <Button
            disabled={
              props.episode.number + 1 > props.episode.series.episodes.length
            }
            className="bg-white text-black hover:text-white ml-auto cursor-pointer"
            onClick={() =>
              router.visit(
                route("anime.episode.show", {
                  mal_id: props.episode.series.mal_id,
                  number: props.episode.number + 1,
                }),
              )
            }
          >
            Next Episode
            <ArrowRightIcon />
          </Button>
        </div>
        {malAnimeEpisodeData && (
          <Card className="bg-zinc-950 shadow-none border-none p-5 pb-10 mt-5">
            <CardHeader className="p-0">
              <CardTitle className="text-light text-gray-300">
                <h1 className="text-4xl">
                  {malAnimeEpisodeData.title_japanese}
                </h1>
                <h6 className="text-2xl">{malAnimeEpisodeData.title}</h6>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Card className="bg-zinc-900 shadow-none border-none p-3 pb-10 mt-5">
                <CardHeader className="p-0">
                  <CardTitle className="text-light text-gray-300">
                    Synopsis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-white mt-5">
                    <p>{malAnimeEpisodeData.synopsis}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 shadow-none border-none p-3 pb-10 mt-5">
                <CardHeader className="p-0">
                  <CardTitle className="text-light text-gray-300">
                    Episodes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveGridWrapper minSize="5rem">
                    {props.episode.series.episodes.map((episode) => (
                      <Link
                        href={route("anime.episode.show", {
                          mal_id: props.episode.series.mal_id,
                          number: episode.number,
                        })}
                      >
                        <div
                          className={cn(
                            "w-full aspect-square text-white flex justify-center items-center border-2 border-gray-700 rounded-xl text-xl",
                            episode.number === props.episode.number
                              ? "bg-gray-700"
                              : "bg-none",
                          )}
                        >
                          {episode.number}
                        </div>
                      </Link>
                    ))}
                  </ResponsiveGridWrapper>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </ContentWrapper>
    </AnimeLayout>
  );
}
