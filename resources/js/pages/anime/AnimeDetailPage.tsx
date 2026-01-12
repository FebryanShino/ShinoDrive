import ContentWrapper from "@/components/app/ContentWrapper";
import { Card, CardContent } from "@/components/ui/card";

export default function AnimeDetailPage(props: {
  anime: {
    id: string;
    name: string;
    mal_id: string;
    episodes: {
      id: string;
      name: string;
      path: string;
      number: number;
      anime_series_id: string;
    }[];
  };
}) {
  return (
    <ContentWrapper>
      {props.anime.name}

      <div className="grid grid-cols-4 grid-flow-row auto-cols-[10rem] gap-1">
        {props.anime.episodes.map((episode) => (
          <a href={`/anime/file/${episode.id}`}>
            <Card>
              <CardContent>{episode.number}</CardContent>
            </Card>
          </a>
        ))}
      </div>
    </ContentWrapper>
  );
}
