"use client";
import { useEffect, useRef, useState } from "react";
import { srcSetFor } from "@/lib/images";

const TONES = [
  "bg-brand-100 text-brand-700",
  "bg-earth-100 text-earth-600",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
];

export const initials = (name = "") =>
  String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

const toneFor = (name = "") => TONES[[...String(name)].reduce((s, ch) => s + ch.charCodeAt(0), 0) % TONES.length];

export default function Avatar({ src, name = "", className = "h-10 w-10", rounded = "rounded-full", text = "text-sm", sizes = "96px" }) {
  const [failed, setFailed] = useState("");
  const ref = useRef(null);
  const broken = !src || failed === src;

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(src);
  }, [src]);

  if (broken) {
    return (
      <span role="img" aria-label={name || "User"} className={`grid shrink-0 select-none place-items-center font-bold ${rounded} ${toneFor(name)} ${text} ${className}`}>
        {initials(name)}
      </span>
    );
  }

  const srcSet = srcSetFor(src);
  return (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={name || "User avatar"}
      decoding="async"
      onError={() => setFailed(src)}
      className={`shrink-0 bg-brand-50 object-cover ${rounded} ${className}`}
    />
  );
}
