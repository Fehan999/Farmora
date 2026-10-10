import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Shipping & Returns | Farmora" };

export default function Shipping() {
  return <LegalPage title="Shipping & Returns" sections={[
    ["3-day delivery promise", "Every order is packed at the farm within 6 hours, shipped within 24 hours and delivered within 72 hours."],
    ["Delivery fees", "Free on orders over $50, otherwise a flat $4.99."],
    ["Live tracking", "Each order page shows a live progress bar through every delivery stage."],
    ["Freshness guarantee", "Not happy with the quality? Tell us within 48 hours and we'll make it right."],
    ["Cancellations", "Orders can be cancelled until they ship."],
  ]} />;
}
