import { Tag } from ".";

export interface CoserInterface {
  id: string;
  name: string;
  translation?: string;
  description?: string;
  photo_set_item?: PhotoSetItemInterface[];
  photo_set?: PhotoSetInterface[];
  photo_set_item_count?: number;
}

export interface PhotoSetItemTagInterface {
  id: string;
  photo_set_item_id: string;
  tag_id: string;
  tag?: Tag;
}

export interface PhotoSetInterface {
  photo_set_item: PhotoSetItemInterface[];
  id: string;
  name: string;
  coser_id?: string;
  photo_set_id?: string;
  datetime?: string;
  path: string;
  tags?: PhotoSetItemTagInterface[];
  coser: CoserInterface;
  photo_item: PhotoSetItemInterface[];
}

export interface PhotoSetItemInterface {
  id: string;
  name: string;
  coser_id?: string;
  photo_set_id?: string;
  extension: string;
  size: number;
  path: string;
  width: number;
  height: number;
  tags?: Tag[];
  coser?: CoserInterface;
  photo_set: PhotoSetInterface;
}
