"use client";
import { useEffect, useState } from "react";

const KEY = "farmora_splash_seen";
const PRE_PAINT = `try{if(sessionStorage.getItem("${KEY}")==="1")document.documentElement.classList.add("splash-seen")}catch(e){}`;

export default function SplashScreen() {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const seen = document.documentElement.classList.contains("splash-seen");
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    if (seen) {
      setPhase("done");
      return;
    }
    const timers = [];
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      timers.push(
        setTimeout(() => {
          setPhase("out");
          timers.push(setTimeout(() => setPhase("done"), 320));
        }, Math.max(0, 350 - performance.now()))
      );
    };
    if (document.readyState === "complete") finish();
    else {
      window.addEventListener("load", finish, { once: true });
      timers.push(setTimeout(finish, Math.max(0, 900 - performance.now())));
    }
    return () => {
      window.removeEventListener("load", finish);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      <div aria-hidden="true" suppressHydrationWarning className={`splash-screen${phase === "out" ? " is-out" : ""}`}>
        <div className="flex flex-col items-center px-6 text-center">
          <span className="splash-mark grid h-20 w-20 place-items-center rounded-3xl bg-brand-600 text-4xl text-white shadow-lg shadow-brand-900/20">🌱</span>
          <div className="splash-text mt-6">
            <p className="font-display text-4xl font-bold tracking-tight text-brand-800">
              Farm<span className="text-earth-500">ora</span>
            </p>
            <p className="mt-2 text-sm font-medium tracking-wide text-gray-500">From Local Farms to Your Door</p>
          </div>
          <div className="mt-7 h-1 w-44 overflow-hidden rounded-full bg-brand-100">
            <span className="splash-bar-fill block h-full w-2/5 rounded-full bg-gradient-to-r from-brand-500 to-earth-400" />
          </div>
        </div>
      </div>
    </>
  );
}
