export interface AnimeSeries {
  id: string;
  name: string;
  mal_id: string;
  episodes: AnimeEpisode[];
  cover: string;
}

export interface AnimeEpisode {
  id: string;
  name: string;
  path: string;
  anime_series_id: string;
  series: AnimeSeries;
  number: number;
  file_extension: string;
}

export interface MALAnimeData {
  mal_id: number;
  url: string;
  images: MALImages;
  trailer: Trailer;
  approved: boolean;
  titles: MALTitle[];
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
  broadcast: MALBroadcast;
  producers: MALEntity[];
  licensors: MALEntity[];
  studios: MALEntity[];
  genres: MALEntity[];
  explicit_genres: MALEntity[];
  themes: MALEntity[];
  demographics: MALEntity[];
}

/* ---------- Sub Types ---------- */

interface MALImages {
  jpg: MALImageFormat;
  webp: MALImageFormat;
}

interface MALImageFormat {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface MALTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: MALTrailerImages;
}

interface MALTrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

interface MALTitle {
  type: string;
  title: string;
}

interface MALAired {
  from: string | null;
  to: string | null;
  prop: {
    from: MALAiredDate;
    to: MALAiredDate;
  };
  string: string;
}

interface MALAiredDate {
  day: number | null;
  month: number | null;
  year: number | null;
}

interface MALBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

interface MALEntity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface MALEpisode {
  mal_id: number;
  url: string | null;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string;
  score: number;
  filler: boolean;
  recap: boolean;
  forum_url: string;
  synopsis?: string;
}
