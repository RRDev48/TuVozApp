export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string | null;
}

export interface PictogramCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Pictogram {
  id: string;
  arasaac_id: string;
  keyword: string;
  arasaac_categories: string[] | null;
  category_id: string;
  language: string;
  last_sync: string | null;
  created_at: string | null;
}
