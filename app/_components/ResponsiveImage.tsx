interface ResponsiveImageProps {
  alt?: string;
  src: string;
  className: string;
}

export default function ResponsiveImage(props: ResponsiveImageProps) {

  return (
    <img src={props.src} alt={props.alt ?? props.src} className={props.className} />
  )
}