import { pinata } from "@/utils/config";

export async function getImageUrl(cid: string) {
  const imageUrl = await pinata.gateways.private.createAccessLink({
    cid,
    expires: 3600, // Link sẽ hết hạn sau 1 giờ
  });
  return imageUrl;
}
