import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description: "Answers about ordering on Farmora, 3-day delivery, live order tracking, payments, returns and selling your produce as a local farmer.",
  path: "/faq",
});

export default function FaqLayout({ children }) {
  return children;
}
