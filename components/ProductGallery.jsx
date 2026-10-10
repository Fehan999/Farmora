"use client";
import { useEffect, useRef, useState } from "react";
import SafeImage from "./SafeImage";

export default function ProductGallery({ images = [], alt = "", fallbackSrc, discount = 0, organic = false, soldOut = false, bestSeller = false }) {
  const list = images.filter(Boolean);
  const count = Math.max(list.length, 1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const zoomRef = useRef(null);
  const touchX = useRef(null);
  const index = Math.min(active, count - 1);

  const go = (dir) => setActive((i) => (Math.min(i, count - 1) + dir + count) % count);

  useEffect(() => {
    if (count < 2) return;
    function onKey(e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowLeft") setActive((i) => (Math.min(i, count - 1) - 1 + count) % count);
      if (e.key === "ArrowRight") setActive((i) => (Math.min(i, count - 1) + 1) % count);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  function onMove(e) {
    if (e.pointerType !== "mouse" || !zoomRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    zoomRef.current.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  }

  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  }

  return (
    <div>
      <div
        className="group relative aspect-[4/3] select-none overflow-hidden rounded-3xl border border-gray-100 bg-brand-50 shadow-sm md:cursor-zoom-in"
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={onMove}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label={`${alt} images`}
      >
        <div ref={zoomRef} className="h-full w-full transition-transform duration-300 ease-out will-change-transform" style={{ transform: zoom ? "scale(1.8)" : "scale(1)" }}>
          <SafeImage key={list[index] || "empty"} src={list[index]} alt={`${alt}${count > 1 ? ` — image ${index + 1} of ${count}` : ""}`} className="h-full w-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority fallbackSrc={fallbackSrc} />
        </div>

        <div className={`pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1.5 transition-opacity ${zoom ? "opacity-0" : ""}`}>
          {discount > 0 && <span className="badge bg-red-500 px-3 py-1 text-sm text-white shadow">-{discount}%</span>}
          {organic && <span className="badge bg-brand-600 px-3 py-1 text-sm text-white shadow">🌱 Organic</span>}
          {bestSeller && <span className="badge bg-white/95 px-3 py-1 text-sm text-amber-700 shadow">★ Best seller</span>}
          {soldOut && <span className="badge bg-gray-900 px-3 py-1 text-sm text-white shadow">Sold out</span>}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl text-gray-800 shadow-md transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl text-gray-800 shadow-md transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">›</button>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">{index + 1} / {count}</span>
          </>
        )}
        <span className={`pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow transition-opacity md:block ${zoom ? "opacity-0" : ""}`}>🔍 Hover to zoom</span>
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button key={`${src}-${i}`} type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={index === i}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${index === i ? "border-brand-600 ring-2 ring-brand-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <SafeImage src={src} alt="" className="h-[72px] w-24 object-cover" sizes="96px" fallbackSrc={fallbackSrc} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
