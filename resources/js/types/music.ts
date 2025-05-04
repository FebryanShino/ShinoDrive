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
