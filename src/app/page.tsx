import Image from "next/image";
export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <Image
            src="/1.jpg"
            width={500}
            height={500}
            alt="Picture of the author"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          {" "}
          <Image
            src="/2.jpg"
            width={500}
            height={500}
            alt="Picture of the author"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          {" "}
          <Image
            src="/3.jpg"
            width={500}
            height={500}
            alt="Picture of the author"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
      <div className="h-full rounded-xl bg-muted/50 relative">
        {" "}
        <Image
          src="/4.jpg"
          fill
          alt="Picture of the author"
          className=" object-cover rounded-xl"
        />
      </div>
    </div>
  );
}
