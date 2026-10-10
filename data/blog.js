import { BLOG_IMAGES } from "./images";
import { FARMERS } from "./seed";

const EHAN = { name: "Ehan Siddique", role: "Founder of Farmora", url: "https://github.com/Fehan999" };
const farmer = (id) => ({ farmerId: id });

const POSTS = [
  {
    slug: "keep-your-greens-fresh-all-week",
    title: "How to Keep Your Greens Fresh All Week",
    category: "Kitchen tips",
    date: "2026-10-06",
    excerpt: "Simple storage habits that keep spinach, lettuce, herbs and microgreens crisp from delivery day to the end of the week.",
    imageAlt: "Fresh baby spinach leaves",
    author: farmer("f8"),
    body: [
      "Most greens don't go bad because they're old. They go bad because they're wet, squashed or sitting next to the wrong thing in the fridge. At Herb Haven we cut our herbs and microgreens the day before they're packed, so they still have plenty of life in them when they reach you. A few small habits will make your spinach, lettuce and herbs last the whole week.",
      "Don't wash anything until you're about to eat it. Water left on the leaves is what turns spinach slimy. If a bag arrives a little damp, tip it onto a clean tea towel, pat it dry and move it to a container lined with a dry paper towel. Swap the towel for a fresh one every couple of days.",
      "Give the leaves some room and keep them cold. A loosely packed box in the crisper drawer works better than a bag squeezed shut, because the leaves aren't crushing each other. Keep apples, pears and tomatoes somewhere else. They give off ethylene, a gas that makes leafy greens yellow and wilt much faster.",
      "Treat soft herbs like cut flowers. Trim the stems of parsley, cilantro and mint, stand them in a jar with an inch of water and loosely cover the tops with a bag. Basil hates the cold, so keep it on the counter out of direct sun. Rosemary and thyme are happiest wrapped in a barely damp paper towel in the fridge, and microgreens should stay in their box, unwashed, in the coldest part of it.",
      "If a head of lettuce starts to droop, it isn't finished. Slice a little off the base and soak the leaves in ice water for fifteen minutes, and they'll crisp right back up. Spinach that's past its best for a salad is still perfect wilted into eggs, soup or pasta, and a handful of tired herbs blended with olive oil, garlic and salt makes a quick sauce that keeps for days.",
    ],
  },
  {
    slug: "why-seasonal-eating-tastes-better",
    title: "Why Seasonal Eating Tastes Better",
    category: "Food",
    date: "2026-09-22",
    excerpt: "Produce picked in season is sweeter, cheaper and often more nutritious. Here's why, and how to eat that way without a chart on the fridge.",
    imageAlt: "Seasonal fruit at a farmers market",
    author: EHAN,
    body: [
      "The first thing I noticed when I started buying straight from farms was how different a tomato tastes in August compared with one bought in February. It isn't nostalgia. Fruit and vegetables grown in their natural season get the sun, warmth and time they need to build up sugar and flavour before they're picked.",
      "Out-of-season produce usually has to travel a long way, so it's picked early and left to ripen in a truck or a warehouse. A peach picked hard will soften, but it won't get any sweeter. The farms on Farmora can pick much closer to ripeness because every order reaches the customer within three days, which just isn't possible with fruit that has to cross an ocean first.",
      "There's a nutrition side to it too. Some vitamins, vitamin C in particular, start to break down as soon as produce is harvested, so the shorter the trip from field to kitchen, the more of them are left when you eat it. Seasonal food also tends to be cheaper, simply because there's more of it. When the orchards are full in September, apples cost less than they do in spring.",
      "You don't need a chart to eat seasonally. Look at what's plentiful and what's on offer, and ask the people who grow it. Right now, in early autumn, that means apples, pears, squash, potatoes, hearty greens and the last of the peppers and tomatoes. Spring brings asparagus, peas and strawberries, and summer is all about berries, stone fruit and sweetcorn.",
      "The part I like most is that it gives the year a rhythm. You look forward to the first strawberries, eat as many as you can while they last, and then move on to whatever comes next. It's one of the easiest ways to eat better without really trying.",
    ],
  },
  {
    slug: "meet-maria-from-sunrise-orchards",
    title: "Meet Maria from Sunrise Orchards",
    category: "Farmer stories",
    date: "2026-09-08",
    excerpt: "Over twenty years of growing apples in Yakima, Washington, and what Maria Gonzalez has learned about picking fruit at exactly the right moment.",
    imageAlt: "Freshly picked apples from the orchard",
    author: EHAN,
    body: [
      "Maria Gonzalez planted her first block of apple trees outside Yakima, Washington in 2005. Today Sunrise Orchards covers 85 acres and grows 18 apple varieties, along with pears, cherries and the peaches her regulars wait for every summer. She still walks the rows most mornings before the picking starts.",
      "“People think the hard part is the picking,” she told me. “It's really the waiting.” Every apple is picked by hand, and each variety comes off the tree when the fruit says it's ready, not when the calendar does. She checks the colour around the stem, how firm it is and how it tastes, and a single block of Honeycrisp might be picked over two or three passes as different trees catch up.",
      "The orchard is certified organic and Salmon-Safe, which means the way the land is farmed has to protect the rivers and streams that run through the valley. In practice that looks like cover crops between the rows, owl boxes and hawk perches to keep the rodents down, and careful watering so nothing runs off into the creek.",
      "Selling directly changed how she plans the season. Instead of sending most of the harvest to a packing house and hoping for a fair price, she lists what's ready each week and ships it within days of picking. “Customers write to me about the apples now,” she said. “That never happened when they went into a big bin with everyone else's.”",
      "Her advice for anyone buying apples: keep them in the fridge, not in a fruit bowl, and they'll stay crisp for weeks. And try a variety you've never heard of. Some of her favourites never make it into supermarkets because they bruise too easily to travel far, and that's exactly why they're worth tracking down.",
    ],
  },
  {
    slug: "beginners-guide-to-sourdough",
    title: "A Beginner's Guide to Sourdough",
    category: "Recipes",
    date: "2026-08-27",
    excerpt: "Daniel from Hearth & Stone Bakery shares the starter method he teaches every new baker, plus a first loaf you can bake at home.",
    imageAlt: "A rustic loaf of country sourdough",
    author: farmer("f5"),
    body: [
      "Every new baker at Hearth & Stone starts the same way: by keeping a starter alive for a week before they're allowed near the oven. A starter is just flour and water that wild yeast and bacteria have moved into. Once it's lively, it's all you need to make bread rise, and it's much easier to look after than most people think.",
      "To make one, stir 50 g of whole wheat or rye flour with 50 g of lukewarm water in a clean jar, cover it loosely and leave it somewhere warm. Every 24 hours, throw away all but about 50 g, then feed it another 50 g of flour and 50 g of water. After five to seven days it should double in size within a few hours of a feed and smell pleasantly sour, a bit like yoghurt. That's when it's ready to bake with.",
      "For your first loaf, mix 100 g of active starter with 350 g of water, then add 500 g of bread flour and 10 g of salt. Leave it for half an hour, then do a set of stretch and folds every 30 minutes for the next two hours: grab one side of the dough, stretch it up, fold it over, turn the bowl and repeat four times. After that, let it rise until it has grown by about half, which can take anywhere from three to eight hours depending on how warm your kitchen is.",
      "Shape the dough into a tight ball, put it seam side up in a floured bowl and leave it in the fridge overnight. The cold slows everything down and gives the bread a deeper flavour. In the morning, heat the oven to 250°C (480°F) with a lidded cast-iron pot inside, tip the dough in, slash the top with a sharp knife and bake for 20 minutes with the lid on, then another 20 to 25 minutes with it off until the crust is a deep brown.",
      "Your first loaf probably won't be perfect, and that's fine. A flat loaf usually means the starter wasn't quite strong enough or the dough rose for too long. Write down your times and temperatures, change one thing at a time, and by the third or fourth bake you'll start to understand what your dough is telling you. Then wait at least an hour before cutting it. That's honestly the hardest part.",
    ],
  },
  {
    slug: "what-regenerative-farming-really-means",
    title: "What Regenerative Farming Really Means",
    category: "Sustainability",
    date: "2026-08-14",
    excerpt: "Healthy soil, healthy food. Robert Hayes explains how Green Valley Farm stopped ploughing and started building its soil back up.",
    imageAlt: "Vegetables growing in healthy farm soil",
    author: farmer("f1"),
    body: [
      "“Regenerative” gets printed on a lot of packaging these days, so it's fair to ask what it actually means. On our farm it comes down to one idea: leave the soil in better shape every year than it was the year before. Healthy soil grows stronger plants, holds more water and needs far less help from outside.",
      "The biggest change we made was to stop ploughing. Turning the soil over breaks up the web of fungi and worm channels that plants rely on, and it lets carbon escape into the air. Now we plant straight into permanent beds and cover them with compost and mulch instead. It took a couple of seasons for the soil to settle, but these days it crumbles in your hand and smells sweet.",
      "We also try never to leave ground bare. As soon as a crop comes out, a cover crop of rye, clover or vetch goes in. The roots hold the soil together through the winter rains, the clover puts nitrogen back into the ground, and in spring we cut it down and leave it on top as mulch for the next planting.",
      "Variety matters as well. Growing more than forty kinds of heirloom vegetables, and moving them around the farm each year, means pests and diseases never get the chance to build up the way they would in a field of one crop. The hedgerows and flower strips along our field edges bring in the ladybugs and tiny wasps that do a lot of our pest control for free.",
      "None of this is new. My grandfather farmed in many of the same ways before chemicals made it easy to skip them. The difference now is that we can measure it: our soil tests show more organic matter every year, and our fields need noticeably less water in August than they did a decade ago. When you buy from a regenerative farm, that's what you're supporting.",
    ],
  },
  {
    slug: "raw-vs-processed-honey",
    title: "Raw vs. Processed Honey",
    category: "Food",
    date: "2026-08-03",
    excerpt: "Aisha from Golden Hive Apiary explains what you lose when honey is heated and filtered, and why a jar that sets solid is a good sign.",
    imageAlt: "A jar of raw wildflower honey",
    author: farmer("f4"),
    body: [
      "Most honey on supermarket shelves has been heated and finely filtered before it's bottled. That makes it look perfectly clear and stops it from setting for months, which is handy for a shop. But it also takes away a lot of what makes honey interesting in the first place.",
      "Raw honey is simply honey that's been spun out of the comb, strained through a coarse mesh to catch bits of wax, and poured into a jar. At Golden Hive we never warm ours above the temperature inside the hive. That keeps the natural enzymes, the pollen and the delicate aromas that change from one harvest to the next. A spring jar from our wildflower meadows tastes nothing like one from late summer.",
      "Heating honey to around 70°C (160°F), which is common in large-scale processing, breaks down some of those enzymes and cooks off much of the flavour. Ultra-fine filtering strips out the pollen as well, and pollen is one of the few ways to tell where a honey actually came from.",
      "The question I get asked most is why raw honey goes solid. That's crystallisation, and it's a sign of good honey, not a fault. Honey holds more sugar than it can keep dissolved, and raw honey has more tiny particles for crystals to form around. If you like it runny, stand the jar in a bowl of warm water, not hot, and stir now and then until it loosens. Please don't put it in the microwave.",
      "One important note: no honey, raw or processed, should be given to babies under a year old. For everyone else, a spoonful of raw honey in yoghurt, on warm toast or whisked into a salad dressing is the easiest way to taste the difference for yourself.",
    ],
  },
];

export const BLOG_POSTS = POSTS
  .map((p, i) => ({ ...p, image: BLOG_IMAGES[i] || "" }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug) => BLOG_POSTS.find((p) => p.slug === slug) || null;

export function postAuthor(post) {
  const a = post?.author || EHAN;
  if (!a.farmerId) return { name: a.name, role: a.role, avatar: "", href: a.url, external: true, location: "" };
  const f = FARMERS.find((x) => x.id === a.farmerId);
  return {
    name: f?.owner || "Farmora farmer",
    role: f?.name || "Farmora partner farm",
    avatar: f?.avatar || "",
    farmerId: a.farmerId,
    href: `/farmers/${a.farmerId}`,
    external: false,
    location: f?.location || "",
  };
}

export const postWords = (post) => (post?.body || []).join(" ").split(/\s+/).filter(Boolean).length;

export const readingTime = (post) => `${Math.max(2, Math.ceil(postWords(post) / 200))} min read`;

export const postDate = (post) =>
  new Date(`${post.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const dayOf = (post) => Date.parse(`${post.date}T00:00:00Z`) / 86400000;

export function relatedPosts(slug, count = 3) {
  const current = getPost(slug);
  if (!current) return BLOG_POSTS.slice(0, count);
  return BLOG_POSTS
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: (p.category === current.category ? 0 : 1000) + Math.abs(dayOf(p) - dayOf(current)) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ p }) => p);
}
