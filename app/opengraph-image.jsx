import { ImageResponse } from "next/og";
import { OG_ALT, SITE_HOST } from "@/lib/seo";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPROUT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#ffffff"/><path d="M32 49V31" fill="none" stroke="#2b7031" stroke-width="4" stroke-linecap="round"/><path d="M32 33C32 22 39.5 15 51 15c0 11.5-7.5 18-19 18z" fill="#5ba95f"/><path d="M32 37c0-9-6.2-15-16-15 0 9.4 6.2 15 16 15z" fill="#2b7031"/><path d="M21 50h22" fill="none" stroke="#c4873a" stroke-width="4" stroke-linecap="round"/></svg>`;
const SPROUT_SRC = `data:image/svg+xml;base64,${Buffer.from(SPROUT).toString("base64")}`;
const STACK = ["Next.js", "React", "Firebase", "Supabase", "Tailwind CSS"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          color: "#ffffff",
          position: "relative",
          backgroundColor: "#204824",
          backgroundImage: "linear-gradient(135deg, #3a8c3f 0%, #245929 48%, #1b3c1f 100%)",
        }}
      >
        <div style={{ position: "absolute", top: -180, right: -140, width: 560, height: 560, borderRadius: 9999, backgroundImage: "radial-gradient(circle, rgba(141,199,143,0.45) 0%, rgba(141,199,143,0) 70%)" }} />
        <div style={{ position: "absolute", bottom: -220, left: -160, width: 520, height: 520, borderRadius: 9999, backgroundImage: "radial-gradient(circle, rgba(212,163,90,0.35) 0%, rgba(212,163,90,0) 70%)" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={SPROUT_SRC} alt="" width={76} height={76} style={{ borderRadius: 18 }} />
            <div style={{ display: "flex", marginLeft: 20, fontSize: 56, letterSpacing: -1 }}>
              <span>Farm</span>
              <span style={{ color: "#d4a35a" }}>ora</span>
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 9999, backgroundColor: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.22)", fontSize: 22, color: "#dcefdc" }}>
            {SITE_HOST}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#bbdfbc", letterSpacing: 4, textTransform: "uppercase" }}>
            Full-stack farm-to-table marketplace
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 70, lineHeight: 1.05, letterSpacing: -2 }}>
            From Local Farms to Your Door
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, lineHeight: 1.35, color: "#dcefdc" }}>
            Fresh food from verified local farmers, delivered in 3 days with live tracking.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 9999, backgroundColor: "#d4a35a", color: "#1b3c1f", fontSize: 26 }}>
              ES
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
              <div style={{ display: "flex", fontSize: 18, color: "#8dc78f", letterSpacing: 3, textTransform: "uppercase" }}>Designed & Developed by</div>
              <div style={{ display: "flex", fontSize: 34 }}>Ehan Siddique</div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {STACK.map((t) => (
              <div key={t} style={{ display: "flex", marginLeft: 10, padding: "7px 14px", borderRadius: 9999, border: "2px solid rgba(255,255,255,0.25)", fontSize: 18, color: "#dcefdc" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
