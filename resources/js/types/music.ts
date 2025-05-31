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
  track_path: string;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  release_date: string;
  track: Track[];
}

export interface Artist {
  id: string;
  name: string;
  description?: string;
  track: Track[];
  album: Album[];
}

export interface Lyric {
  id: string;
  text: string;
  timestamp: number;
  track_id: string;
}
