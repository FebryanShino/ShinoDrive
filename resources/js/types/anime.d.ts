export interface MALAnimeData {
  mal_id: string;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string | null;
  season: string;
  year: number;
  broadcast: Broadcast;
  producers: Entity[];
  licensors: Entity[];
  studios: Entity[];
  genres: Entity[];
  explicit_genres: Entity[];
  themes: Entity[];
  demographics: Entity[];
}

/* ---------- Sub Types ---------- */

interface Images {
  jpg: ImageFormat;
  webp: ImageFormat;
}

interface ImageFormat {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface Trailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: TrailerImages;
}

interface TrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

interface Title {
  type: string;
  title: string;
}

interface Aired {
  from: string | null;
  to: string | null;
  prop: {
    from: AiredDate;
    to: AiredDate;
  };
  string: string;
}

interface AiredDate {
  day: number | null;
  month: number | null;
  year: number | null;
}

interface Broadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

interface Entity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}
