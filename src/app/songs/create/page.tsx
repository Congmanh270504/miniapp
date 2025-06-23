import Iridescence from "@/components/ui/react-bits/backgrounds/Iridescence/Iridescence";
import React from "react";

const Page = () => {
  return (
    <Iridescence
      color={[1, 1, 1]}
      mouseReact={false}
      amplitude={0.1}
      speed={1.0}
    />
  );
};

export default Page;
