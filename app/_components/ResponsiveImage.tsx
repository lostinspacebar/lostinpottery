import fs from "fs/promises";
import path from "path";

interface ResponsiveImageProps {
  alt?: string;
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

  const imageSizes = [ 150, 300, 600, 1000 ];
  const srcset = [];
  const sizes = [];
  for (const imageSize of imageSizes) {
    const urlForSize = path.join(pathInfo.dir.replace("/images", "/images/.resized"), resizedImages.find(name => name.startsWith(`${pathInfo.name}-${imageSize}x`)) as string);
    srcset.push(`${urlForSize} ${imageSize}w`);
    sizes.push(`(max-width: ${imageSize * 3}px) ${imageSize}px`);
  }

  return (
    <div style={{ aspectRatio }} className="responsive-image-container">
      <img
        src={props.src}
        srcSet={srcset.join(', ')}
        sizes={sizes.join(', ')}
        alt={props.alt ?? props.src}
        className={props.className}
        style={{ aspectRatio }}
      />
    </div>
  );
}
