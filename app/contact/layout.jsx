import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Questions about an order, selling your harvest on Farmora or the project itself? Send the Farmora team a message and we will get back to you.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
