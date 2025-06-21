import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min relative">
      {" "}
      <Image
        src="/4.jpg"
        fill
        alt="Picture of the author"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
};

export default page;
