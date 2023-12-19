import ResponsiveImage from "@/app/_components/ResponsiveImage";
import { getAllPotIds, getPot } from "@/lib/getPots";
import Link from "next/link";

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

  const gallery = pot.images.map((image) => {
    //const responsiveImagesInfo = await getResponsiveImages(image);
    return (
      <div key={image} className="gallery-item">
        <a href={image} target="_blank">
          <ResponsiveImage
            alt="LOST.IN.POTTERY"
            className=""
            src={image}
            size={25}
          />
        </a>
      </div>
    );
  });

  const claimButton =
    pot.status === "available" ? (
      <Link className="btn btn-wide" href="#get-this-piece">
        Get this piece -- ${pot.price} USD
      </Link>
    ) : (
      <button className="btn btn-wide" disabled aria-disabled>
        Sorry, someone already has this piece.
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
        <div className="gallery col-span-2">{gallery}</div>
      </div>
      {pot.status === "available" && (
        <>
          <h3 id="get-this-piece">Get this piece</h3>
          <p>
            The goal of this endeavour is to get pots in people&apos;s hands and
            raise money for worthy causes along the way.
          </p>
          <p>
            The recommmend price for this is piece is  <span className="price-highlight">${pot.price} USD</span>. But
            nothing is stopping you from giving a little more to a cause you
            care about :)
          </p>
          <h4>Step 1. Send money</h4>
          <p>
            Donate the recommended price ($
            {pot.price} USD or more) to a charity of your choice.
          </p>
          <p>
            Here are a few good ones to choose from.
          </p>
          <ul>
            <li>
              <Link
                href="https://www.charitynavigator.org/ein/840772672"
                target="_blank"
              >
                Food Bank of the Rockies
              </Link>
            </li>
            <li>
              <Link
                href="https://www.charitynavigator.org/ein/931057665"
                target="_blank"
              >
                Palestine Children&apos;s Relief Fund
              </Link>
            </li>
            <li>
              <Link
                href="https://www.charitynavigator.org/ein/840611876"
                target="_blank"
              >
                Native American Rights Fund
              </Link>
            </li>
            <li>
              <Link
                href="https://www.charitynavigator.org/ein/954681287"
                target="_blank"
              >
                Trevor Project
              </Link>
            </li>
          </ul>
          <h4>Step 2. Send me a message</h4>
          <p>
            Send me an email (hello@lostinpottery.com) or DM on Instagram (@lostinpottery) and tell me about your donation and where to send your pot.
          </p>
        </>
      )}
    </div>
  );
}
