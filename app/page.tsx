import { getAllPots } from "@/lib/getPots";

export default async function Home() {
  const pots = await getAllPots();
  const cards = pots.map((pot) => (
    <div key={pot.id} className="relative card">
      <a href={pot.link}>
        <img className="w-full object-cover mt-4 md:mt-8" src={pot.heroImage} />
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
          <img className="w-full object-cover" src="/images/main-card-bg.jpg" />
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
