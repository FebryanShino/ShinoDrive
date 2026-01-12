import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MALAnimeData } from "@/types/anime";
import { useForm } from "@inertiajs/react";
import { Image } from "antd";
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IAnimeEpisode {
  file: File;
  episodeNumber: number;
}

export default function AnimeUploadFormPage() {
  const {
    data: formData,
    setData: setFormData,
    post,
    progress,
    processing,
    transform,
  } = useForm<{ title: string; mal_id: string; episodes: any }>({
    title: "",
    mal_id: "",
    episodes: [],
  });
  const [animeEpisodes, setAnimeEpisodes] = useState<IAnimeEpisode[]>();
  const [animeSeries, setAnimeSeries] = useState<MALAnimeData>();
  const [animeSeriesSearchTitle, setAnimeSeriesSearchTitle] =
    useState("class daikirai");
  const [animeSeriesList, setAnimeSeriesList] = useState<MALAnimeData[]>();

  async function searchAnimeOnMAL(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${animeSeriesSearchTitle}&limit=10`,
    );
    const data: {
      pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        current_page: number;
        items: {
          count: number;
          total: number;
          per_page: number;
        };
      };
      data: MALAnimeData[];
    } = await response.json();

    setAnimeSeriesList(data.data);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (animeSeries) {
      transform((data) => ({
        ...data,
        title: animeSeries.title,
        mal_id: animeSeries.mal_id,
        episodes: animeEpisodes,
      }));

      post("/anime/upload", {
        onFinish: () => toast(`Images has been Added`, {}),
      });
    }
  }
  function rearrangeEpisode(
    episodes: IAnimeEpisode[],
    currentEpisode: IAnimeEpisode,
    direction: "UP" | "DOWN",
  ) {
    const updatedEpisodes = episodes.map((episode) => {
      if (direction === "UP") {
        if (episode.episodeNumber === currentEpisode.episodeNumber - 1) {
          return {
            ...episode,
            episodeNumber: episode.episodeNumber + 1,
          };
        }
        if (episode.file.name === currentEpisode.file.name) {
          return {
            ...episode,
            episodeNumber: currentEpisode.episodeNumber - 1,
          };
        }
        return episode;
      } else {
        if (episode.file.name === currentEpisode.file.name) {
          return {
            ...episode,
            episodeNumber: currentEpisode.episodeNumber + 1,
          };
        }
        if (episode.episodeNumber === currentEpisode.episodeNumber + 1) {
          return {
            ...episode,
            episodeNumber: episode.episodeNumber - 1,
          };
        }
        return episode;
      }
    });

    return updatedEpisodes as IAnimeEpisode[];
  }

  return (
    <ContentWrapper>
      <form
        className="flex w-full max-w-sm items-center gap-2"
        onSubmit={searchAnimeOnMAL}
      >
        <Input onChange={(e) => setAnimeSeriesSearchTitle(e.target.value)} />
        <Button type="submit">
          <Search />
        </Button>
      </form>
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {animeSeriesList &&
            animeSeriesList.map((series) => (
              <div key={series.mal_id} onClick={() => setAnimeSeries(series)}>
                <div className="text-sm">{series.title}</div>
                <Separator className="my-2" />
              </div>
            ))}
        </div>
      </ScrollArea>
      <Card className="mt-3">
        <CardHeader>
          <CardTitle>Anime Information</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 h-auto">
          <Image
            src={animeSeries?.images.jpg.image_url}
            className="rounded-lg h-full aspect-[225/318]"
          />
          <div className="w-[80%] h-auto flex flex-col justify-between bg-amber-300">
            <div>
              <h1 className="font-light text-2xl">
                {animeSeries?.title_japanese}
              </h1>
              <h4>{animeSeries?.title}</h4>
            </div>
            <p className="text-xs ">{animeSeries?.synopsis}</p>
          </div>
        </CardContent>
      </Card>
      <div className="w-full flex h-80 mt-3 gap-3">
        <Card className="h-full w-auto, aspect-square">
          <CardContent>
            <input
              className="w-full h-full"
              type="file"
              name=""
              id=""
              accept="video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files as FileList);
                const allowedMime = [
                  "video/mp4",
                  "video/mkv",
                  "video/webm",
                  "video/quicktime",
                ];
                setAnimeEpisodes(
                  files
                    .filter((file) => allowedMime.includes(file.type))
                    .map((file, index) => ({
                      file: file,
                      episodeNumber: index + 1,
                    })),
                );
              }}
            />
          </CardContent>
        </Card>
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Rearrange episode</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-full max-h-[90%] w-full rounded-md border p-3">
              {animeEpisodes &&
                animeEpisodes
                  .toSorted((a, b) => a.episodeNumber - b.episodeNumber)
                  .map((episode) => (
                    <div className="flex border rounded-md mb-2 p-1 items-center">
                      <div className="h-8 aspect-square border-r-[1px] flex justify-center items-center">
                        {episode.episodeNumber}
                      </div>
                      <span className="ml-2">{episode.file.name}</span>
                      <ButtonGroup className="ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setAnimeEpisodes(
                              rearrangeEpisode(animeEpisodes, episode, "UP"),
                            )
                          }
                        >
                          <ChevronUpIcon />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setAnimeEpisodes(
                              rearrangeEpisode(animeEpisodes, episode, "DOWN"),
                            )
                          }
                        >
                          <ChevronDownIcon />
                        </Button>
                      </ButtonGroup>
                    </div>
                  ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Upload</Button>
      </form>
    </ContentWrapper>
  );
}
