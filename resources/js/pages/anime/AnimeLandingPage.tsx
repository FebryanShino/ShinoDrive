import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function AnimeLandingPage(props: {
  animeList: { id: string; name: string; mal_id: string }[];
}) {
  console.log(props.animeList);
  return (
    <ContentWrapper>
      Anime list
      <div>
        {props.animeList.map((anime) => (
          <Link href={`anime/id/${anime.mal_id}`}>
            <Button>
              <p>{anime.name}</p>
            </Button>
          </Link>
        ))}
      </div>
    </ContentWrapper>
  );
}
