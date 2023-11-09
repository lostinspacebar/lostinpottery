import { getAllPots } from "@/lib/getPots";
import FilteredListing from "./_components/FilteredListing";
import MainListingItem from "./_components/MainListingItem";
import ResponsiveImage from "./_components/ResponsiveImage";

export default async function Home() {
  const pots = await getAllPots();
  const cards = pots.map((pot) => (
    <MainListingItem key={pot.id} pot={pot} />
  ));

  return (
    <div>
      <div className="relative columns-3 gap-4 md:gap-8">
        <div className="relative card main-card">
          <ResponsiveImage
            alt="LOST.IN.POTTERY"
            className="w-full h-auto object-cover"
            src="/images/main-card-bg.jpg"
            size={50}
          />
          <div className="info absolute bottom-0">
            Hi!
            <br />
            My name is Aditya,
            <br />
            and I like making pots.
          </div>
        </div>
        <FilteredListing pots={pots}>{cards}</FilteredListing>
      </div>
    </div>
  );
}
