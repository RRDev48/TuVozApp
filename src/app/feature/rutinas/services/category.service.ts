import { supabase } from "@/src/lib/supabaseClient";
import { Category } from "../models/category.types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("task_categories")
    .select("id, name, image_url");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data ?? []).map((item: any) => ({
    id: String(item.id),
    nombre: item.name,
    image: item.image_url,
  })) as Category[];
}
