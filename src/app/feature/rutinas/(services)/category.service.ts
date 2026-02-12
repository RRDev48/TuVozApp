import { supabase } from "@/src/lib/supabaseClient";
import { Category } from "../(models)/category.types";

/**
 * Obtiene todas las categorías disponibles para las rutinas desde Supabase
 * y las mapea al modelo de dominio `Category` usado en la app.
 *
 * En caso de error, se registra en consola y se devuelve un arreglo vacío
 * para que la UI pueda manejar el estado sin romper el flujo.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("routine_categories")
    .select("id, name, image_url");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Se mapean los campos de la tabla (id, name, image_url) al modelo
  // de dominio esperado por la app (id, nombre, image).
  return (data ?? []).map((item: any) => ({
    id: String(item.id),
    nombre: item.name,
    image: item.image_url,
  })) as Category[];
}
