import { CATEGORIES, FARMERS, PRODUCTS } from "@/data/seed";
import { pageMeta, productDescription, productImages, productJsonLd, toJsonLd } from "@/lib/seo";

function lookup(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return {};
  return {
    product,
    farmer: FARMERS.find((f) => f.id === product.farmerId),
    category: CATEGORIES.find((c) => c.slug === product.category),
  };
}

export function generateMetadata({ params }) {
  const { product, farmer, category } = lookup(params.id);
  if (!product) {
    return pageMeta({
      title: "Fresh Farm Product",
      description: "Fresh, locally grown food from verified farmers, delivered to your door in 3 days with Farmora.",
      path: `/product/${params.id}`,
    });
  }
  return pageMeta({
    title: farmer ? `${product.name} from ${farmer.name}` : product.name,
    description: productDescription(product, farmer),
    path: `/product/${product.id}`,
    images: productImages(product, category).slice(0, 3).map((url) => ({ url, width: 1200, alt: product.name })),
    keywords: [product.name, category?.name, farmer?.name, `buy ${product.name.toLowerCase()} online`].filter(Boolean),
  });
}

export default function ProductLayout({ children, params }) {
  const { product, farmer, category } = lookup(params.id);
  return (
    <>
      {product && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd(product, farmer, category)) }} />}
      {children}
    </>
  );
}
