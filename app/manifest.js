import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, THEME_COLOR } from "@/lib/seo";

export default function manifest() {
  return {
    id: "/",
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: THEME_COLOR,
    lang: "en-US",
    dir: "ltr",
    categories: ["shopping", "food", "lifestyle"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
