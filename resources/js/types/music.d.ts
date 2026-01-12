export interface Track {
  id: string;
  title: string;
  artist_id: string;
  album_id: string;
  cover: string;
  track_number: number;
  disk_number: number;
  genre_id?: string;
  album?: Album;
  artist?: Artist;
  lyrics: Lyric[];
  filepath: string;
  filetype: string;
  genre: Genre;
  year: string;
  duration: number;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  artist_id: string;
  release_date: string;
  tracks: Track[];
  track_total: number;
  disc_total: number;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Artist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  albums: Album[];
}

export interface Lyric {
  id: string;
  text: string;
  timestamp: number;
  track_id: string;
}

export type RepeatMode = "off" | "one" | "all";
