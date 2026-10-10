import { pexels, avatar } from "@/lib/images";
import { PHOTOS } from "./photos";

const photo = (key, i = 0, w = 800) => {
  const ids = PHOTOS[key] || [];
  const id = ids[i] ?? ids[0];
  return id ? pexels(id, w) : "";
};

export const CATEGORIES = [
  { slug: "vegetables", name: "Vegetables", icon: "🥕", image: photo("cat:vegetables", 0, 1000) },
  { slug: "fruits", name: "Fruits", icon: "🍎", image: photo("cat:fruits", 0, 1000) },
  { slug: "dairy", name: "Dairy & Eggs", icon: "🥚", image: photo("cat:dairy", 0, 1000) },
  { slug: "bakery", name: "Bakery", icon: "🍞", image: photo("cat:bakery", 0, 1000) },
  { slug: "honey", name: "Honey & Jams", icon: "🍯", image: photo("cat:honey", 0, 1000) },
  { slug: "meat", name: "Meat & Poultry", icon: "🍗", image: photo("cat:meat", 0, 1000) },
  { slug: "grains", name: "Grains & Pulses", icon: "🌾", image: photo("cat:grains", 0, 1000) },
  { slug: "herbs", name: "Herbs & Spices", icon: "🌿", image: photo("cat:herbs", 0, 1000) },
];

export const FARMERS = [
  { id: "f1", role: "farmer", name: "Green Valley Farm", owner: "Robert Hayes", email: "robert@greenvalley.farm", phone: "+1 (541) 555-0142", location: "Eugene, Oregon", since: 1998, acres: 120, rating: 4.9, reviews: 312, verified: true, avatar: avatar("men", 32), cover: photo("f1", 0, 1200), specialty: "Heirloom vegetables", bio: "Third-generation family farm growing over 40 varieties of heirloom vegetables using regenerative, no-till methods.", certifications: ["USDA Organic", "Regenerative Certified"], joined: "2024-01-14" },
  { id: "f2", role: "farmer", name: "Sunrise Orchards", owner: "Maria Gonzalez", email: "maria@sunriseorchards.com", phone: "+1 (509) 555-0198", location: "Yakima, Washington", since: 2005, acres: 85, rating: 4.8, reviews: 268, verified: true, avatar: avatar("women", 44), cover: photo("f2", 0, 1200), specialty: "Apples, pears & stone fruit", bio: "Sun-ripened fruit picked at peak sweetness. We grow 18 apple varieties and the juiciest peaches in the valley.", certifications: ["USDA Organic", "Salmon-Safe"], joined: "2024-02-03" },
  { id: "f3", role: "farmer", name: "Meadow Creek Dairy", owner: "Thomas Becker", email: "thomas@meadowcreek.dairy", phone: "+1 (608) 555-0110", location: "Madison, Wisconsin", since: 1987, acres: 210, rating: 4.9, reviews: 401, verified: true, avatar: avatar("men", 45), cover: photo("f3", 0, 1200), specialty: "Grass-fed dairy", bio: "Our 90 Jersey cows graze open pasture year-round, producing rich milk, butter and award-winning cheeses.", certifications: ["Animal Welfare Approved", "Grass-Fed"], joined: "2024-01-28" },
  { id: "f4", role: "farmer", name: "Golden Hive Apiary", owner: "Aisha Rahman", email: "aisha@goldenhive.co", phone: "+1 (512) 555-0177", location: "Austin, Texas", since: 2012, acres: 30, rating: 4.7, reviews: 189, verified: true, avatar: avatar("women", 65), cover: photo("f4", 0, 1200), specialty: "Raw honey & bee products", bio: "Over 200 hives across wildflower meadows. Raw, unfiltered honey harvested in small batches.", certifications: ["Certified Naturally Grown"], joined: "2024-03-11" },
  { id: "f5", role: "farmer", name: "Hearth & Stone Bakery", owner: "Daniel Murphy", email: "daniel@hearthstone.bake", phone: "+1 (802) 555-0133", location: "Burlington, Vermont", since: 2010, acres: 5, rating: 4.8, reviews: 222, verified: true, avatar: avatar("men", 52), cover: photo("f5", 0, 1200), specialty: "Wood-fired sourdough", bio: "Farm bakery milling our own heritage wheat and baking in a wood-fired stone oven every morning.", certifications: ["Local Grain Alliance"], joined: "2024-04-02" },
  { id: "f6", role: "farmer", name: "Willow Bend Ranch", owner: "Sarah Mitchell", email: "sarah@willowbend.ranch", phone: "+1 (406) 555-0161", location: "Bozeman, Montana", since: 1979, acres: 640, rating: 4.6, reviews: 154, verified: true, avatar: avatar("women", 68), cover: photo("f6", 0, 1200), specialty: "Pasture-raised meats", bio: "Pasture-raised beef, lamb and poultry raised humanely on open Montana rangeland.", certifications: ["Animal Welfare Approved", "Grass-Fed"], joined: "2024-02-19" },
  { id: "f7", role: "farmer", name: "Prairie Gold Grains", owner: "James Okafor", email: "james@prairiegold.farm", phone: "+1 (785) 555-0124", location: "Manhattan, Kansas", since: 2001, acres: 900, rating: 4.7, reviews: 97, verified: false, avatar: avatar("men", 86), cover: photo("f7", 0, 1200), specialty: "Ancient grains & pulses", bio: "Stone-milled flours, ancient grains and heirloom beans grown without synthetic inputs.", certifications: ["USDA Organic"], joined: "2024-05-07" },
  { id: "f8", role: "farmer", name: "Herb Haven Gardens", owner: "Lily Chen", email: "lily@herbhaven.garden", phone: "+1 (415) 555-0186", location: "Sonoma, California", since: 2015, acres: 12, rating: 4.9, reviews: 176, verified: true, avatar: avatar("women", 79), cover: photo("f8", 0, 1200), specialty: "Culinary herbs & microgreens", bio: "Small greenhouse farm specialising in fragrant herbs, edible flowers and microgreens.", certifications: ["USDA Organic"], joined: "2024-06-15" },
];

export const BUYERS = [
  { id: "b1", name: "Emily Carter", email: "emily.carter@mail.com", phone: "+1 (212) 555-0101", location: "New York, NY", avatar: avatar("women", 12), orders: 24, spent: 1286.4, joined: "2024-02-11", status: "active" },
  { id: "b2", name: "Michael Brown", email: "m.brown@mail.com", phone: "+1 (312) 555-0145", location: "Chicago, IL", avatar: avatar("men", 22), orders: 17, spent: 842.15, joined: "2024-03-02", status: "active" },
  { id: "b3", name: "Sophia Martinez", email: "sophia.m@mail.com", phone: "+1 (305) 555-0166", location: "Miami, FL", avatar: avatar("women", 26), orders: 31, spent: 1890.0, joined: "2024-01-20", status: "active" },
  { id: "b4", name: "David Kim", email: "dkim@mail.com", phone: "+1 (206) 555-0172", location: "Seattle, WA", avatar: avatar("men", 36), orders: 9, spent: 410.75, joined: "2024-05-18", status: "active" },
  { id: "b5", name: "Olivia Johnson", email: "olivia.j@mail.com", phone: "+1 (617) 555-0118", location: "Boston, MA", avatar: avatar("women", 33), orders: 12, spent: 655.3, joined: "2024-04-09", status: "active" },
  { id: "b6", name: "Liam Wilson", email: "liam.w@mail.com", phone: "+1 (303) 555-0191", location: "Denver, CO", avatar: avatar("men", 41), orders: 5, spent: 188.9, joined: "2024-07-01", status: "suspended" },
  { id: "b7", name: "Ava Thompson", email: "ava.t@mail.com", phone: "+1 (503) 555-0150", location: "Portland, OR", avatar: avatar("women", 57), orders: 42, spent: 2741.6, joined: "2023-12-05", status: "active" },
  { id: "b8", name: "Noah Patel", email: "noah.patel@mail.com", phone: "+1 (408) 555-0139", location: "San Jose, CA", avatar: avatar("men", 61), orders: 14, spent: 703.2, joined: "2024-03-27", status: "active" },
  { id: "b9", name: "Isabella Rossi", email: "isabella.r@mail.com", phone: "+1 (702) 555-0127", location: "Las Vegas, NV", avatar: avatar("women", 48), orders: 7, spent: 299.45, joined: "2024-06-22", status: "active" },
  { id: "b10", name: "Ethan Nguyen", email: "ethan.n@mail.com", phone: "+1 (713) 555-0184", location: "Houston, TX", avatar: avatar("men", 75), orders: 19, spent: 1022.8, joined: "2024-02-28", status: "active" },
  { id: "b11", name: "Mia Anderson", email: "mia.a@mail.com", phone: "+1 (612) 555-0193", location: "Minneapolis, MN", avatar: avatar("women", 90), orders: 3, spent: 96.5, joined: "2024-08-14", status: "active" },
  { id: "b12", name: "Lucas Silva", email: "lucas.s@mail.com", phone: "+1 (480) 555-0108", location: "Phoenix, AZ", avatar: avatar("men", 64), orders: 11, spent: 588.0, joined: "2024-04-30", status: "active" },
];

const P = (id, name, category, farmerId, price, unit, stock, tag, n, extra = {}) => ({
  id, name, category, farmerId, price, unit, stock,
  image: photo(id),
  gallery: (PHOTOS[id] || []).map((pid) => pexels(pid)),
  rating: extra.rating ?? +(4.3 + ((n * 7) % 7) / 10).toFixed(1),
  reviewsCount: extra.reviewsCount ?? 20 + ((n * 13) % 180),
  sold: extra.sold ?? 50 + ((n * 37) % 900),
  organic: extra.organic ?? true,
  featured: extra.featured ?? false,
  discount: extra.discount ?? 0,
  description: extra.description ?? `Freshly harvested ${name.toLowerCase()} straight from the farm. Grown with care, picked at peak ripeness and delivered within three days so it reaches your kitchen full of flavour and nutrients.`,
  status: "approved",
  createdAt: "2024-06-01T10:00:00.000Z",
});

export const PRODUCTS = [
  P("p1", "Heirloom Tomatoes", "vegetables", "f1", 5.99, "lb", 120, "tomato", 1, { featured: true, discount: 10 }),
  P("p2", "Rainbow Carrots", "vegetables", "f1", 3.49, "bunch", 90, "carrot", 2, { featured: true }),
  P("p3", "Baby Spinach", "vegetables", "f1", 4.25, "bag", 60, "spinach", 3),
  P("p4", "Crisp Romaine Lettuce", "vegetables", "f1", 2.99, "head", 75, "lettuce", 4),
  P("p5", "Purple Eggplant", "vegetables", "f1", 3.79, "lb", 40, "eggplant", 5),
  P("p6", "Sweet Bell Peppers", "vegetables", "f1", 4.49, "lb", 85, "pepper", 6, { discount: 15 }),
  P("p7", "Fresh Broccoli Crowns", "vegetables", "f8", 3.29, "lb", 55, "broccoli", 7),
  P("p8", "Yukon Gold Potatoes", "vegetables", "f7", 2.49, "lb", 300, "potato", 8, { organic: false }),
  P("p9", "Honeycrisp Apples", "fruits", "f2", 3.99, "lb", 200, "apple", 9, { featured: true }),
  P("p10", "Juicy Peaches", "fruits", "f2", 4.99, "lb", 140, "peach", 10, { discount: 20, featured: true }),
  P("p11", "Bartlett Pears", "fruits", "f2", 3.59, "lb", 110, "pear", 11),
  P("p12", "Fresh Strawberries", "fruits", "f2", 6.49, "pint", 70, "strawberry", 12, { featured: true }),
  P("p13", "Wild Blueberries", "fruits", "f2", 7.99, "pint", 50, "blueberry", 13),
  P("p14", "Bing Cherries", "fruits", "f2", 8.49, "lb", 45, "cherry", 14, { discount: 10 }),
  P("p15", "Seedless Watermelon", "fruits", "f1", 7.49, "each", 30, "watermelon", 15),
  P("p16", "Whole Grass-Fed Milk", "dairy", "f3", 5.49, "half gal", 80, "milk", 16, { featured: true }),
  P("p17", "Pasture-Raised Eggs", "dairy", "f3", 6.99, "dozen", 150, "eggs", 17, { featured: true }),
  P("p18", "Aged Farmhouse Cheddar", "dairy", "f3", 9.99, "8 oz", 60, "cheese", 18),
  P("p19", "Cultured Butter", "dairy", "f3", 7.49, "lb", 45, "butter", 19),
  P("p20", "Greek Yogurt", "dairy", "f3", 4.99, "16 oz", 70, "yogurt", 20, { discount: 5 }),
  P("p21", "Country Sourdough Loaf", "bakery", "f5", 8.0, "loaf", 40, "sourdough", 21, { featured: true }),
  P("p22", "Whole Wheat Sandwich Bread", "bakery", "f5", 6.5, "loaf", 35, "bread", 22),
  P("p23", "Butter Croissants", "bakery", "f5", 12.0, "4 pack", 25, "croissant", 23),
  P("p24", "Cinnamon Rolls", "bakery", "f5", 14.0, "6 pack", 20, "cinnamon", 24, { discount: 10 }),
  P("p25", "Raw Wildflower Honey", "honey", "f4", 12.99, "16 oz", 90, "honey", 25, { featured: true }),
  P("p26", "Comb Honey", "honey", "f4", 18.99, "8 oz", 30, "honeycomb", 26),
  P("p27", "Strawberry Jam", "honey", "f2", 7.99, "12 oz", 60, "jam", 27),
  P("p28", "Beeswax Candles", "honey", "f4", 15.0, "set of 2", 40, "candle", 28, { organic: false }),
  P("p29", "Grass-Fed Ground Beef", "meat", "f6", 9.99, "lb", 100, "beef", 29, { featured: true }),
  P("p30", "Free-Range Whole Chicken", "meat", "f6", 18.5, "each", 35, "chicken", 30),
  P("p31", "Lamb Chops", "meat", "f6", 22.0, "lb", 25, "lamb", 31),
  P("p32", "Smoked Bacon", "meat", "f6", 11.49, "lb", 50, "bacon", 32, { discount: 10 }),
  P("p33", "Stone-Milled Flour", "grains", "f7", 6.99, "5 lb", 80, "flour", 33),
  P("p34", "Organic Quinoa", "grains", "f7", 8.49, "2 lb", 65, "quinoa", 34),
  P("p35", "Heirloom Black Beans", "grains", "f7", 4.99, "lb", 90, "beans", 35),
  P("p36", "Rolled Oats", "grains", "f7", 5.49, "2 lb", 110, "oats", 36),
  P("p37", "Fresh Basil", "herbs", "f8", 2.99, "bunch", 60, "basil", 37, { featured: true }),
  P("p38", "Sunflower Microgreens", "herbs", "f8", 4.49, "clamshell", 40, "microgreens", 38),
  P("p39", "Garden Mint", "herbs", "f8", 2.49, "bunch", 55, "mint", 39),
  P("p40", "Rosemary & Thyme Bundle", "herbs", "f8", 3.99, "bundle", 45, "rosemary", 40, { discount: 5 }),
];

export const REVIEWS = [
  { name: "Emily Carter", avatar: avatar("women", 12), rating: 5, text: "The tomatoes taste like the ones from my grandmother's garden. Delivery was right on schedule!" },
  { name: "Michael Brown", avatar: avatar("men", 22), rating: 5, text: "Love knowing exactly which farm my food comes from. The eggs are incredible." },
  { name: "Sophia Martinez", avatar: avatar("women", 26), rating: 4, text: "Great quality and fair prices. The live delivery tracker is a nice touch." },
  { name: "Ava Thompson", avatar: avatar("women", 57), rating: 5, text: "I've replaced my weekly grocery run with Farmora. Fresher food, happier family." },
  { name: "Noah Patel", avatar: avatar("men", 61), rating: 5, text: "The sourdough from Hearth & Stone is the best bread I've ever had." },
];

const statuses = ["placed", "placed", "placed", "cancelled"];
export function seedOrders() {
  const now = Date.now();
  return Array.from({ length: 18 }, (_, i) => {
    const buyer = BUYERS[i % BUYERS.length];
    const items = [PRODUCTS[(i * 3) % 40], PRODUCTS[(i * 7 + 5) % 40]].map((p, k) => ({
      productId: p.id, name: p.name, price: p.price, image: p.image, farmerId: p.farmerId, unit: p.unit, qty: 1 + ((i + k) % 3),
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    return {
      id: `ORD-${(10240 + i).toString()}`,
      buyerId: buyer.id, buyerName: buyer.name, buyerEmail: buyer.email,
      items, farmerIds: [...new Set(items.map((x) => x.farmerId))],
      subtotal, shipping: subtotal > 50 ? 0 : 4.99, tax: subtotal * 0.05, discount: 0,
      total: subtotal + (subtotal > 50 ? 0 : 4.99) + subtotal * 0.05,
      address: { fullName: buyer.name, street: `${100 + i * 7} Market Street`, city: buyer.location.split(",")[0], zip: `${90000 + i * 37}`, phone: buyer.phone },
      payment: i % 2 ? "Card" : "Cash on Delivery",
      status: statuses[i % 4],
      createdAt: new Date(now - i * 9 * 36e5).toISOString(),
      seed: true,
    };
  });
}

export const DEMO_ACCOUNTS = {
  admin: { email: "admin@farmora.demo", password: "farmora123", name: "Demo Admin", role: "admin" },
  farmer: { email: "farmer@farmora.demo", password: "farmora123", name: "Robert Hayes", role: "farmer", farmerId: "f1" },
  buyer: { email: "buyer@farmora.demo", password: "farmora123", name: "Emily Carter", role: "buyer" },
};
