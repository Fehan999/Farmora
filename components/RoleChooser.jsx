import { ROLES } from "./authRoles";

export default function RoleChooser({ onPick }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {["buyer", "farmer"].map((key) => {
          const r = ROLES[key];
          return (
            <button key={key} type="button" onClick={() => onPick(key)}
              className="group flex items-center gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:flex-col sm:items-start sm:p-5">
              <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl transition group-hover:scale-105 group-hover:bg-brand-100">{r.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-brand-900">{r.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-gray-500">{r.blurb}</span>
                <span className="mt-3 hidden items-center gap-1 text-sm font-semibold text-brand-700 sm:inline-flex">
                  Continue <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                </span>
              </span>
              <span aria-hidden="true" className="text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-brand-600 sm:hidden">→</span>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={() => onPick("admin")}
        className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-gray-200 px-4 py-3 text-left transition hover:border-earth-400 hover:bg-earth-50 focus-visible:border-earth-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-earth-100">
        <span aria-hidden="true" className="text-xl">{ROLES.admin.icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-800">{ROLES.admin.title}</span>
          <span className="block text-xs text-gray-500">For recruiters and visitors: see the marketplace from the admin side.</span>
        </span>
        <span aria-hidden="true" className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-earth-600">→</span>
      </button>
    </div>
  );
}
