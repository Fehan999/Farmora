"use client";
import { useEffect, useState } from "react";
import { srcSetFor } from "@/lib/images";

const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#dcefdc'/><text x='200' y='165' font-size='64' text-anchor='middle'>🌱</text></svg>`
);

export default function SafeImage({ src, alt = "", className = "", sizes = "(max-width: 640px) 90vw, 400px", priority = false, fallbackSrc }) {
  const [stage, setStage] = useState(0);

  useEffect(() => { setStage(0); }, [src, fallbackSrc]);

  const effective = stage === 0 && !src ? 1 : stage;
  const current = effective === 0 ? src : effective === 1 && fallbackSrc ? fallbackSrc : FALLBACK;
  const srcSet = current === FALLBACK ? undefined : srcSetFor(current);

  function onError() {
    setStage((s) => {
      const from = s === 0 && !src ? 1 : s;
      return from === 0 && fallbackSrc ? 1 : 2;
    });
  }

  return (
    <img
      src={current || FALLBACK}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={onError}
      className={`bg-brand-50 ${className}`}
    />
  );
}
