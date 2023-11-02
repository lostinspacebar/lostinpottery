import { getAllPotIds, getPot } from "@/lib/getPots";

export async function generateStaticParams() {
  const ids = await getAllPotIds();
  return ids.map((id) => {
    id;
  });
}

export default async function PotDetails({
  params,
}: {
  params: { id: string };
}) {
  const pot = await getPot(params.id);
  const gallery = pot.images.map((image) => (
    <div key={image} className="gallery-item w-full mb-4 md:mb-8">
      <a href={image}>
        <img src={image} className="rounded-box" />
      </a>
    </div>
  ));

  return (
    <div>
      <p>
        <a href="/" className="go-back-link">
          ᐊ back to all pots
        </a>
      </p>
      <h2>{pot.name}</h2>
      <div className="relative columns-3 gap-4 md:gap-8 gallery">{gallery}</div>
    </div>
  );
}
