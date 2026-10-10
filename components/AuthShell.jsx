import SafeImage from "./SafeImage";
import Logo from "./Logo";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-100px)] lg:grid-cols-2">
      <div className="relative hidden bg-brand-800 lg:block">
        <SafeImage src="https://loremflickr.com/900/1000/farm,field?lock=404" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="font-display text-4xl font-bold">From Local Farms<br />to Your Door.</h2>
          <p className="mt-3 max-w-md text-brand-100">Join a community of growers and food lovers building a fresher, fairer food system.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
