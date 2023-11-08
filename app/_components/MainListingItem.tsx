import { Pot } from "@/lib/pot";
import ResponsiveImage from "./ResponsiveImage";

interface MainListingItemProps {
  pot: Pot
}

export default function MainListingItem(props: MainListingItemProps) {
  const pot = props.pot;

  return (
    <div className="relative card">
      <a href={pot.link}>
        <ResponsiveImage
          alt="LOST.IN.POTTERY"
          className="w-full h-auto object-cover mt-4 md:mt-8"
          src={pot.heroImage}
          size={50}
        />
        <div className="info">
          <h2>{pot.name}</h2>
          <div className="description">{pot.description}</div>
          <div className="status">{pot.status}</div>
        </div>
      </a>
    </div>
  )
}