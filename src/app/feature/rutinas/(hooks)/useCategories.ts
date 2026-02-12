// React
import { useEffect, useState } from "react";

// Componentes

// Constantes

// Modelos
import { Category } from "../(models)/category.types";

// Hooks

// Servicios
import { getCategories } from "../(services)/category.service";

// Acciones

// Visuales

/**
 * Hook que se encarga de cargar las categorías de rutina desde el servicio
 * cuando un modal o vista asociada está visible.
 *
 * Recibe:
 * - `visible`: normalmente el estado de visibilidad del modal de categorías.
 *
 * Expone:
 * - `categories`: listado de categorías ya mapeadas al modelo `Category`.
 * - `loading`: indica si la carga está en progreso.
 */
export function useCategories(visible: boolean) {
  // Lista de categorías disponibles para asignar a una tarea.
  const [categories, setCategories] = useState<Category[]>([]);
  // Flag de carga para mostrar feedback en la UI mientras se consultan datos.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getCategories()
        .then((cats) => setCategories(cats))
        .finally(() => setLoading(false));
    }
  }, [visible]);

  return { categories, loading };
}
