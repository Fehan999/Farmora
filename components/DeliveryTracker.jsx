"use client";
import { useEffect, useState } from "react";
import { STAGES, deliveryStatus, formatRemaining } from "@/lib/delivery";
import { dateTime } from "@/lib/format";

export default function DeliveryTracker({ order, compact = false }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const s = deliveryStatus(order, now);

  if (s.cancelled) {
    return <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">✖ This order was cancelled.</div>;
  }

  if (compact) {
    return (
      <div>
        <div className="mb-1 flex justify-between text-xs font-medium">
          <span className="text-brand-700">{s.stage.icon} {s.stage.label}</span>
          <span className="text-gray-500">{formatRemaining(s.remaining)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${s.percent}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Estimated delivery</p>
          <p className="text-lg font-bold text-gray-900">{dateTime(s.eta)}</p>
        </div>
        <span className={`badge px-3 py-1 text-sm ${s.delivered ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"}`}>
          {s.delivered ? "Delivered" : formatRemaining(s.remaining)}
        </span>
      </div>
      <div className="relative mb-8 mt-10 h-3 rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700" style={{ width: `${s.percent}%` }} />
        <div className="animate-truck absolute -top-8 -translate-x-1/2 text-2xl" style={{ left: `${Math.min(97, Math.max(3, s.percent))}%` }}>🚚</div>
      </div>
      <ol className="grid grid-cols-5 gap-2 text-center">
        {STAGES.map((st, i) => (
          <li key={st.key} className="flex flex-col items-center">
            <span className={`grid h-10 w-10 place-items-center rounded-full text-lg ${i <= s.stageIndex ? "bg-brand-600 text-white shadow" : "bg-gray-100 grayscale"}`}>{st.icon}</span>
            <span className={`mt-2 text-xs font-semibold ${i <= s.stageIndex ? "text-brand-700" : "text-gray-400"}`}>{st.label}</span>
            <span className="text-[10px] text-gray-400">+{st.at}h</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-center text-xs text-gray-400">Live tracker · every Farmora order is delivered within 3 days (72 hours)</p>
    </div>
  );
}
