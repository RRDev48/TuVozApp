import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";

const GIFS = [
  require("@/src/app/assets/gif/alerta.gif"),
  require("@/src/app/assets/gif/verificado.gif"),
  require("@/src/app/assets/gif/llave.gif"),
];

export const usePreloadGifs = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preload = async () => {
      try {
        await Promise.all(
          GIFS.map((gif) => ExpoImage.prefetch(gif))
        );
      } catch (error) {
      } finally {
        setLoaded(true);
      }
    };

    preload();
  }, []);

  return loaded;
};

export default usePreloadGifs;