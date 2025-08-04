import AudioUpload from "@/components/custom/audio-upload";
import Iridescence from "@/components/ui/react-bits/backgrounds/Iridescence/Iridescence";
import React from "react";

const Page = () => {
  return (
    <Iridescence
      color={[1, 1, 1]}
      mouseReact={false}
      amplitude={0.1}
      speed={1.0}
      children={
        <div className="absolute top-20 inset-0 h-fit 2xl:top-28">
          <AudioUpload />
        </div>
      }
    />
  );
};

export default Page;
