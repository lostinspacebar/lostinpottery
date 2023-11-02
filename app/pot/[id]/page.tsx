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
  const pot = await getPot(params.id, true);
  const fullPageContent = pot.pageContent as string;
  const contentParts = fullPageContent.split("<p>{{DETAILS}}</p>");
  const description = contentParts[0] ?? "";
  const details = contentParts[1] ?? "";

  const gallery = pot.images.map((image) => (
    <div key={image} className="gallery-item w-full mb-4 md:mb-8">
      <a href={image}>
        <img src={image} className="rounded-box" />
      </a>
    </div>
  ));

  const claimButton =
    pot.status === "available" ? (
      <button className="btn btn-wide">Get this mug!</button>
    ) : (
      <button className="btn btn-wide" disabled aria-disabled>
        Sorry, someone already has this mug.
      </button>
    );

  return (
    <div>
      <p>
        <a href="/" className="go-back-link">
          ᐊ back to all pots
        </a>
      </p>
      <h2>{pot.name}</h2>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <div
            className="potDescription"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {claimButton}
          <div
            className="potDetails"
            dangerouslySetInnerHTML={{ __html: details }}
          />
        </div>
        <div className="gallery">{gallery}</div>
      </div>
    </div>
  );
}
