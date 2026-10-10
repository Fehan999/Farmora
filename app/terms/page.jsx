import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms of Service | Farmora" };

export default function Terms() {
  return <LegalPage title="Terms of Service" sections={[
    ["1. Using Farmora", "Farmora is a marketplace connecting independent farmers with buyers. By creating an account you agree to provide accurate information and use the platform lawfully."],
    ["2. Sellers", "Farmers are responsible for the accuracy of their listings, the quality of their products and fulfilling orders within the 3-day delivery window."],
    ["3. Orders & payments", "Prices are set by farmers. Orders are confirmed when placed and can be cancelled until they ship."],
    ["4. Refunds", "If a product arrives damaged or not as described, contact us within 48 hours for a refund or replacement."],
    ["5. Accounts", "We may suspend accounts that violate these terms or harm other members of the community."],
  ]} />;
}
