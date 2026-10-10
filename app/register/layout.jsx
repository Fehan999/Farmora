import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Create an Account",
  description: "Join Farmora as a customer to shop fresh local food, or as a farmer to sell your harvest online to buyers near you.",
  path: "/register",
});

export default function RegisterLayout({ children }) {
  return children;
}
