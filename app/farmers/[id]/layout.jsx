import { FARMERS } from "@/data/seed";
import { resize } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export function generateMetadata({ params }) {
  const farmer = FARMERS.find((f) => f.id === params.id);
  if (!farmer) {
    return pageMeta({
      title: "Farmer Profile",
      description: "Meet a verified local farmer on Farmora and buy fresh food direct from the farm.",
      path: `/farmers/${params.id}`,
    });
  }
  return pageMeta({
    title: `${farmer.name} — ${farmer.specialty}`,
    description: `${farmer.name}, run by ${farmer.owner} in ${farmer.location} since ${farmer.since}. ${farmer.bio} Shop their ${farmer.specialty.toLowerCase()} on Farmora.`,
    path: `/farmers/${farmer.id}`,
    images: farmer.cover ? [{ url: resize(farmer.cover, 1200), width: 1200, alt: `${farmer.name} in ${farmer.location}` }] : undefined,
    keywords: [farmer.name, farmer.owner, farmer.specialty, `${farmer.location} farm`, "local farmer"],
  });
}

export default function FarmerProfileLayout({ children }) {
  return children;
}
