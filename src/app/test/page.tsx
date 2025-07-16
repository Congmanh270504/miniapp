import { pinata } from "@/utils/config";
import React from "react";

const Page = async () => {
  const data = await pinata.gateways.private
    .get("bafybeiaujxrzrzablzpnbedbam5w7tkjmr4ckq5a5fntv32c655akwhuie")
    .optimizeImage({
      width: 500,
      height: 500,
      format: "webp",
    });
  console.log(data);

  return <div>aaa</div>;
};

export default Page;
