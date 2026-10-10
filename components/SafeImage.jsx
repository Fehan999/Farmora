"use client";
import { useState } from "react";

const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#dcefdc'/><text x='200' y='165' font-size='64' text-anchor='middle'>🌱</text></svg>`
);

export default function SafeImage({ src, alt = "", className = "" }) {
  const [err, setErr] = useState(false);
  return <img src={err || !src ? FALLBACK : src} alt={alt} loading="lazy" onError={() => setErr(true)} className={className} />;
}
