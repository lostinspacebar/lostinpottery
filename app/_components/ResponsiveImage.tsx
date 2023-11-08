import fs from "fs/promises";
import path from "path";

interface ResponsiveImageProps {
  alt?: string;
  size?: number;
  src: string;
  className: string;
}

export default async function ResponsiveImage(props: ResponsiveImageProps) {
  const pathInfo = path.parse(props.src);
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

  const size = `${props.size ?? 100}vw`;
  const imageSizes = [ 200, 500, 800 ];
  const srcset = [];
  const sizes = [];
  for (const imageSize of imageSizes) {
    const urlForSize = path.join(pathInfo.dir.replace("/images", "/images/.resized"), resizedImages.find(name => name.startsWith(`${pathInfo.name}-${imageSize}x`)) as string);
    srcset.push(`${urlForSize} ${imageSize}w`);
  }

  return (
    <div style={{ aspectRatio }} className="responsive-image-container">
      <img
        src={props.src}
        srcSet={srcset.join(', ')}
        sizes={size}
        alt={props.alt ?? props.src}
        className={props.className}
        style={{ aspectRatio }}
      />
    </div>
  );
}
