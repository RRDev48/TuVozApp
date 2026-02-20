import { useCallback, useMemo } from "react";

interface TextSizeButton {
  size: "pequenia" | "mediana" | "grande";
  labelKey: string;
}

export const useTextSizeButtons = (
  tamanioLetra: string,
  setTamanioLetra: (size: "pequenia" | "mediana" | "grande") => void,
) => {
  const buttons: TextSizeButton[] = useMemo(
    () => [
      { size: "pequenia", labelKey: "Pequeña" },
      { size: "mediana", labelKey: "Mediana" },
      { size: "grande", labelKey: "Grande" },
    ],
    [],
  );

  const handleSetSize = useCallback(
    (size: "pequenia" | "mediana" | "grande") => {
      setTamanioLetra(size);
    },
    [setTamanioLetra],
  );

  return { buttons, handleSetSize, isGrande: tamanioLetra === "grande" };
};
