export interface PictogramCategory {
  id: number;
  category_slug: string;
  arasaac_id: number;
}

export interface Pictogram {
  id: number;
  arasaac_id: number;
  keyword: string;
  arasaac_categories: string[] | null;
  category_slug: string;
  language: string;
  last_sync: string | null;
  created_at: string | null;
}
