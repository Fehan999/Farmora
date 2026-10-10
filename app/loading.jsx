import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-24">
      <Spinner size={56} label="Loading fresh goodness..." />
    </div>
  );
}
