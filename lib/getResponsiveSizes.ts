import fs from "fs/promises";
import path from "path";

interface ResponsiveImageInfo {
  sourceUrl: string;
  aspectRatio: number;
  images: Map<number, string>;
  imageSizes: number[];
  largestImageUrl: string;
}

export const getResponsiveImages = async (imageUrl: string) : Promise<ResponsiveImageInfo> => {
  const pathInfo = path.parse(imageUrl);
  const resizedImagesDir = path.join(
    process.cwd(),
    "public",
    "images",
    ".resized"
  );
  const relativeResizedImagesDir = path.join(
    resizedImagesDir,
    pathInfo.dir.replace("/images", "")
  );
  const resizedImages = (await fs.readdir(relativeResizedImagesDir)).filter(
    (fileName) => fileName.startsWith(pathInfo.name)
  );

  const sizeRegexp = new RegExp(`${pathInfo.name}-\(\\d+\)x\(\\d+\).jpg`, "g");
  const match = sizeRegexp.exec(resizedImages[0]);
  let aspectRatio = 1;
  if (match) {
    aspectRatio = Number(match[1]) / Number(match[2]);
  }

  const images = new Map<number, string>();
  const imageSizes = [200, 500, 800, 2000];
  let largestImageUrl = '';
  for (const imageSize of imageSizes) {
    const urlForSize = path.join(
      pathInfo.dir.replace("/images", "/images/.resized"),
      resizedImages.find((name) =>
        name.startsWith(`${pathInfo.name}-${imageSize}x`)
      ) as string
    );
    images.set(imageSize, urlForSize);
    if (imageSize === 2000) {
      largestImageUrl = urlForSize;
    }
  }

  return {
    sourceUrl: imageUrl,
    aspectRatio,
    images,
    imageSizes,
    largestImageUrl
  };
};