import { getAllPots } from "@/lib/getPots";
import ResponsiveImage from "./_components/ResponsiveImage";

export default async function Home() {
  const pots = await getAllPots();
  const cards = pots.map((pot) => (
    <div key={pot.id} className="relative card">
      <a href={pot.link}>
        <ResponsiveImage
          alt="LOST.IN.POTTERY"
          className="w-full h-auto object-cover mt-4 md:mt-8"
          src={pot.heroImage}
        />
        <div className="info">
          <h2>{pot.name}</h2>
          <div className="description">{pot.description}</div>
          <div className="status">{pot.status}</div>
        </div>
      </a>
    </div>
  ));

  return (
    <div>
      <div className="relative columns-2 gap-4 md:gap-8">
        <div className="relative card main-card">
          <ResponsiveImage
            alt="LOST.IN.POTTERY"
            className="w-full h-auto object-cover"
            src="/images/main-card-bg.jpg"
          />
          <div className="info absolute bottom-0">
            Hi!
            <br />
            My name is Aditya,
            <br />
            and I like making pots.
          </div>
        </div>
        {cards}
      </div>
    </div>
  );
}
