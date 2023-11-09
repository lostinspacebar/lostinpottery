import { getResponsiveImages } from "@/lib/getResponsiveSizes";

interface ResponsiveImageProps {
  alt?: string;
  size?: number;
  src: string;
  className: string;
}

export default async function ResponsiveImage(props: ResponsiveImageProps) {
  const responsiveImagesInfo = await getResponsiveImages(props.src);
  const size = `${props.size ?? 100}vw`;
  const srcset = [];
  const sizes = [];
  for (const imageSize of responsiveImagesInfo.imageSizes) {
    srcset.push(`${responsiveImagesInfo.images.get(imageSize)} ${imageSize}w`);
  }

  const classes = props.className + " responsive-image-container";

  return (
    <div
      style={{ aspectRatio: responsiveImagesInfo.aspectRatio }}
      className={classes}
    >
      <img
        src={responsiveImagesInfo.largestImageUrl}
        srcSet={srcset.join(", ")}
        sizes={size}
        alt={props.alt ?? props.src}
        className={props.className}
        style={{ aspectRatio: responsiveImagesInfo.aspectRatio }}
      />
    </div>
  );
}
