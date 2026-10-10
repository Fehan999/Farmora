const PEXELS_HOST = "images.pexels.com";
const WIDTHS = [320, 480, 640, 960, 1280];

export const pexels = (id, w = 800) =>
  `https://${PEXELS_HOST}/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const avatar = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

export function isPexels(src) {
  return typeof src === "string" && src.includes(PEXELS_HOST);
}

export function resize(src, w) {
  if (!isPexels(src)) return src;
  return src.replace(/([?&])w=\d+/, `$1w=${w}`);
}

export function srcSetFor(src) {
  if (!isPexels(src) || !/[?&]w=\d+/.test(src)) return undefined;
  return WIDTHS.map((w) => `${resize(src, w)} ${w}w`).join(", ");
}
