import OpengraphImage from "./opengraph-image";
import { OG_ALT } from "@/lib/seo";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return OpengraphImage();
}
