import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy", description: "How Farmora collects, uses and protects your personal information when you shop or sell on the farm-to-table marketplace.", alternates: { canonical: "/privacy" }, openGraph: { type: "website", siteName: "Farmora", locale: "en_US", url: "/privacy", title: "Privacy Policy", description: "How Farmora collects, uses and protects your personal information when you shop or sell on the farm-to-table marketplace.", images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", title: "Privacy Policy", description: "How Farmora collects, uses and protects your personal information when you shop or sell on the farm-to-table marketplace.", creator: "Ehan Siddique", images: ["/twitter-image"] } };

export default function Privacy() {
  return <LegalPage title="Privacy Policy" sections={[
    ["Information we collect", "Account details (name, email, phone), delivery addresses and order history needed to run the marketplace."],
    ["How we use it", "To process orders, coordinate delivery with farmers, provide support and improve Farmora."],
    ["Sharing", "Farmers only see the details needed to fulfil your order. We never sell your personal data."],
    ["Storage & security", "Data is stored with Firebase and Supabase using industry-standard encryption."],
    ["Your rights", "You can update your profile at any time or contact us to delete your account."],
  ]} />;
}
