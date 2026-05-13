import { Pictogram } from "../../expresate/models/pictogram.types";

const ARASAAC_API_BASE = "https://api.arasaac.org/api/pictograms";

export const arasaacService = {
  searchPictograms: async (query: string, language: string = "es"): Promise<Pictogram[]> => {
    try {
      const response = await fetch(`${ARASAAC_API_BASE}/${language}/search/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error("Error searching in ARASAAC");
      }

      const data = await response.json();
      
      // Mapear el formato de ARASAAC al formato de nuestra App
      return data.map((item: any) => ({
        id: item._id.toString(),
        arasaac_id: item._id.toString(),
        keyword: item.keywords?.[0]?.keyword || "Sin nombre",
        image_url: `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`,
        category_id: "", // Se asignará al guardar
        language: language,
      }));
    } catch (error) {
      console.error("ARASAAC Search Error:", error);
      return [];
    }
  },

  getPictogramById: async (id: string, language: string = "es"): Promise<Pictogram | null> => {
    try {
      const response = await fetch(`${ARASAAC_API_BASE}/${language}/${id}`);
      if (!response.ok) return null;
      
      const item = await response.json();
      return {
        id: item._id.toString(),
        arasaac_id: item._id.toString(),
        keyword: item.keywords?.[0]?.keyword || "Sin nombre",
        image_url: `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`,
        category_id: "",
        language: language,
      };
    } catch {
      return null;
    }
  }
};
