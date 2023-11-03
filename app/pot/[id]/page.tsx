import { getAllPotIds, getPot } from "@/lib/getPots";
import Image from "next/image";

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
    <div key={image} className="gallery-item">
      <a href={image} target="_blank">
        <Image
          alt="LOST.IN.POTTERY"
          className="rounded-box w-full h-auto"
          src={image}
          width="0"
          height="0"
          sizes="25w"
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxdpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRCRjc1ODVENzIwMDExRUU5Mzc4QkRDM0IzQjk2QjUzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRCRjc1ODVDNzIwMDExRUU5Mzc4QkRDM0IzQjk2QjUzIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMDI0IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSIyNkQ0QjRBNDA2NUNGQTlGNDEyRkE3RTNBQzY5QkM2MyIgc3RSZWY6ZG9jdW1lbnRJRD0iMjZENEI0QTQwNjVDRkE5RjQxMkZBN0UzQUM2OUJDNjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/uvIyAAAAMFBMVEUDI0oGMWMCGTcFLVwAAAAEKVUBBxgCEisBDSIGM2cAAwoDHkAHNmsNDQ0HNWoZGRkXs9ORAAAB6ElEQVR42rSW63bDIAiAQSp4Sd37v+3SYAgmpmfd2fzVGj/ugvD1/HB9wePjBc9PieffIRwgEuaMBCH9AEmAi18Z+D2SaLmumO6REpf5gnKDSHanGq7u2D/kKRKaHQDRI0Uq6m6WCRJ2gGR0T63N6YJI14HymMcEywnhbnfcHeUkycJbX/LghPRYadWVEFVCo5qOyKQBCZ4I+ZoVxu2rQzTjcZqcVjeGFvSIKskvP8ok/6B6yCN6LDinJsyjOIRVic8OhcQskL1tPmJbDFUU+lyvgkHT1dIJUWNeu6IH+FJGdEI29W272odTQxr3vR0phxwyp9aTUZwNNCDpSArar022ZqSZ3TMk269L3KtHZKaFybLrvo9ayATm3uVeMQnmK3rEZbK66BQzR50ZgqxbbHSTXVID83AZrti1xCAVIducaIHDGc5j4+PRcEM0JBp5aZcS1pqhsV3kI4xDN6NyGAsjAr6O9urtvne79OOB9JrIvcTL2vpjDMUHZ0uqv/tdMPJkbvmL6ZDSJ0SWG6JfId/HLFDW5HV7HzZ10sar9SBINs2s29B0WFTXuWj1nvCU0cmwqMvdwnQ3xQRvCH4z+KC9m3rz8cqQ72fr7dwXINNFlX/6umCRECSV/3yQvEV+8bj6/An3LcAAyuJGQ56C3IIAAAAASUVORK5CYII="
        />
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
        <div className="gallery col-span-2">{gallery}</div>
      </div>
    </div>
  );
}
