import { Button } from "@/components/ui/button";
import React from "react";
import { pinata } from "@/utils/config";
import Image from "next/image";

const Page = async () => {
  const cid = "bafkreieqqy6tlfouuwlz3uvculj5fg4yen23iy46nnxzdltztzbpx5vkse";

  // Lấy thông tin metadata của ảnh
  const imageUrl = await pinata.gateways.private.createAccessLink({
    cid: "bafkreieqqy6tlfouuwlz3uvculj5fg4yen23iy46nnxzdltztzbpx5vkse",
    expires: 3600, // Link sẽ hết hạn sau 1 giờ
  });

  console.log("imageUrl", imageUrl);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pinata Image Display</h1>

      {/* Hiển thị ảnh sử dụng Next.js Image component */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Using Next.js Image:</h2>
        <Image
          src={imageUrl}
          alt="Pinata Image"
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Page;
