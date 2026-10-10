"use client";

export default function DashboardShell({ title, subtitle, tabs, tab, setTab, actions, children }) {
  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="card h-fit p-2 lg:sticky lg:top-28">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium ${tab === t.key ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
