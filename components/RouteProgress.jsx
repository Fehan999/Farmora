"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams()?.toString() || "";
  const [bar, setBar] = useState({ value: 0, visible: false, instant: true });
  const active = useRef(false);
  const timers = useRef({});

  const clear = useCallback(() => {
    const t = timers.current;
    clearInterval(t.trickle);
    clearTimeout(t.failsafe);
    clearTimeout(t.hide);
    clearTimeout(t.reset);
    timers.current = {};
  }, []);

  const done = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    clear();
    if (reducedMotion()) {
      setBar({ value: 0, visible: false, instant: true });
      return;
    }
    setBar({ value: 100, visible: true, instant: false });
    timers.current.hide = setTimeout(() => setBar({ value: 100, visible: false, instant: false }), 220);
    timers.current.reset = setTimeout(() => setBar({ value: 0, visible: false, instant: true }), 600);
  }, [clear]);

  const start = useCallback(() => {
    if (active.current) return;
    clear();
    active.current = true;
    const still = reducedMotion();
    setBar({ value: still ? 100 : 12, visible: true, instant: true });
    if (!still) {
      timers.current.trickle = setInterval(() => {
        setBar((b) => ({ ...b, instant: false, value: Math.min(90, b.value + Math.max(0.4, (90 - b.value) * (0.06 + Math.random() * 0.08))) }));
      }, 250);
    }
    timers.current.failsafe = setTimeout(done, 10000);
  }, [clear, done]);

  useEffect(() => {
    done();
  }, [pathname, search, done]);

  useEffect(() => {
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href], button, input, select, textarea, label, [role=button]") : null;
      if (!a || a.tagName !== "A" || typeof a.href !== "string") return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      const here = window.location;
      if (url.origin !== here.origin) return;
      if (url.pathname === here.pathname && url.search === here.search) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("farmora:navstart", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("farmora:navstart", start);
      clear();
      active.current = false;
    };
  }, [start, clear]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]">
      <div
        className="route-progress-bar"
        style={{
          transform: `translate3d(${bar.value - 100}%,0,0)`,
          opacity: bar.visible ? 1 : 0,
          transition: bar.instant ? "opacity .3s ease" : undefined,
        }}
      />
    </div>
  );
}
