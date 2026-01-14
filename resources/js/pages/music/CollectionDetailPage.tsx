import ContentWrapper from "@/components/app/ContentWrapper";
import MusicLayout from "@/layouts/app/music-layout";
import { Collection } from "@/types/music";

interface CollectionDetailPageProps {
  collection: Collection;
}
export default function CollectionDetailPage(props: CollectionDetailPageProps) {
  return (
    <MusicLayout>
      <ContentWrapper>
        <div>{props.collection.name}</div>
      </ContentWrapper>
    </MusicLayout>
  );
}
