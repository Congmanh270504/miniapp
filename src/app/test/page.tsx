import { pinata } from "@/utils/config";
import React from "react";

const Page = async () => {
  const { data, contentType } = await pinata.gateways.private.get(
    "bafkreia5iwitz6q2pz45iqu42zqjbhwmbnaj36kv2i4bn5fdhzzttfhbxa"
  );
  console.log(data, contentType);
  return <div>Page</div>;
};

export default Page;
