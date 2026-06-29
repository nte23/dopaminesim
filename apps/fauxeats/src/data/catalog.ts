/*
 * Fully fictional catalog. No real brands, no real logos — this is both the
 * legal-safe path (fictional marks only) and on-theme. Prices and calories are
 * made up. Food is rendered as emoji art, so there are zero image-licensing
 * concerns in this scaffold; a Pixabay/AI image layer can slot in later.
 */

export type LngLat = [number, number];

export type Dish = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  kcal: number;
  desc: string;
};

export type Restaurant = {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  blurb: string;
  eta: string;
  rating: number;
  /** restaurant pickup point on the map */
  from: LngLat;
  /** the user's "home" drop-off */
  to: LngLat;
  dishes: Dish[];
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "pizza-mirage",
    name: "Pizza Mirage",
    emoji: "🍕",
    cuisine: "Italian",
    blurb: "Wood-fired in your imagination.",
    eta: "15–25 min",
    rating: 4.8,
    from: [4.8852, 52.373],
    to: [4.901, 52.3645],
    dishes: [
      { id: "margherita", name: "Phantom Margherita", emoji: "🍕", price: 12.5, kcal: 1100, desc: "Tomato, mozzarella, and the lingering memory of basil." },
      { id: "pepperoni", name: "Ghost Pepperoni", emoji: "🍕", price: 14, kcal: 1320, desc: "Extra pepperoni you will never taste." },
      { id: "calzone", name: "Vanishing Calzone", emoji: "🥟", price: 13, kcal: 1500, desc: "Folded over a generous pocket of pure nothing." },
      { id: "garlic", name: "Null Garlic Bread", emoji: "🥖", price: 6.5, kcal: 600, desc: "Garlic, butter, void." },
      { id: "tiramisu", name: "Tiramisù Interruptus", emoji: "🍰", price: 7, kcal: 450, desc: "A pick-me-up that never picks up." },
    ],
  },
  {
    id: "wok-and-roll",
    name: "Wok & Roll",
    emoji: "🥡",
    cuisine: "Pan-Asian",
    blurb: "Stir-fried suspense.",
    eta: "18–30 min",
    rating: 4.7,
    from: [4.879, 52.368],
    to: [4.899, 52.359],
    dishes: [
      { id: "padthai", name: "Imaginary Pad Thai", emoji: "🍜", price: 13.5, kcal: 980, desc: "Tamarind, peanuts, and plausible deniability." },
      { id: "dumplings", name: "Make-Believe Dumplings", emoji: "🥟", price: 8.5, kcal: 520, desc: "Six little pockets of maybe." },
      { id: "friedrice", name: "Placebo Fried Rice", emoji: "🍚", price: 11, kcal: 870, desc: "Wok hei not included." },
      { id: "springrolls", name: "Spectral Spring Rolls", emoji: "🥢", price: 6, kcal: 410, desc: "Crispy on the outside, absent on the inside." },
      { id: "bubbletea", name: "Faux Bubble Tea", emoji: "🧋", price: 5.5, kcal: 350, desc: "Chew on the concept of tapioca." },
    ],
  },
  {
    id: "bun-voyage",
    name: "Bun Voyage",
    emoji: "🍔",
    cuisine: "Burgers",
    blurb: "Have a great trip to nowhere.",
    eta: "12–22 min",
    rating: 4.6,
    from: [4.9005, 52.376],
    to: [4.888, 52.365],
    dishes: [
      { id: "nothingburger", name: "The Nothingburger", emoji: "🍔", price: 11.5, kcal: 850, desc: "All the fixings, none of the patty's commitment." },
      { id: "doublemirage", name: "Double Mirage", emoji: "🍔", price: 14.5, kcal: 1180, desc: "Twice the beef you won't be eating." },
      { id: "cloudfries", name: "Cloud Fries", emoji: "🍟", price: 5, kcal: 480, desc: "So light they float off the plate and out of existence." },
      { id: "airnuggets", name: "Air Nuggets (12)", emoji: "🍗", price: 8, kcal: 700, desc: "Aerodynamically perfect. Nutritionally theoretical." },
      { id: "shake", name: "Milkshake of Theseus", emoji: "🥤", price: 6.5, kcal: 720, desc: "Is it still a shake if you never sip it?" },
    ],
  },
  {
    id: "sushi-limbo",
    name: "Sushi Limbo",
    emoji: "🍣",
    cuisine: "Sushi",
    blurb: "Caught fresh from the void.",
    eta: "20–32 min",
    rating: 4.9,
    from: [4.892, 52.36],
    to: [4.91, 52.37],
    dishes: [
      { id: "schrodinger", name: "Schrödinger Roll (8)", emoji: "🍣", price: 15, kcal: 600, desc: "Simultaneously eaten and not, until you open the box." },
      { id: "nigiri", name: "Salmon Nigiri (6)", emoji: "🍣", price: 12, kcal: 360, desc: "Hand-pressed by a chef who isn't there." },
      { id: "edamame", name: "Edamame Placebo", emoji: "🫛", price: 5.5, kcal: 190, desc: "Pop the pods of possibility." },
      { id: "miso", name: "Miso Maybe", emoji: "🍲", price: 4, kcal: 90, desc: "Warm, comforting, hypothetical." },
      { id: "mochi", name: "Mochi Vacío (3)", emoji: "🍡", price: 6, kcal: 300, desc: "Chewy little spheres of absence." },
    ],
  },
  {
    id: "faux-caesar",
    name: "Faux Caesar",
    emoji: "🥗",
    cuisine: "Healthy-ish",
    blurb: "The salad you'll order and never eat.",
    eta: "14–24 min",
    rating: 4.5,
    from: [4.8835, 52.3625],
    to: [4.902, 52.3705],
    dishes: [
      { id: "caesar", name: "Guilt-Free Caesar", emoji: "🥗", price: 11, kcal: 520, desc: "The only Caesar with genuinely zero calories consumed." },
      { id: "quinoa", name: "Quinoa Quantum Bowl", emoji: "🥙", price: 13, kcal: 640, desc: "Superfoods in superposition." },
      { id: "avotoast", name: "Avocado Apparition Toast", emoji: "🥑", price: 10, kcal: 430, desc: "Now you sea-salt it, now you don't." },
      { id: "smoothie", name: "Smoothie of Denial", emoji: "🥤", price: 8, kcal: 280, desc: "Blended, poured, and quietly forgotten." },
      { id: "kale", name: "Kale Hallucination", emoji: "🥬", price: 9, kcal: 210, desc: "You'll swear it was massaged." },
    ],
  },
  {
    id: "sugar-crash",
    name: "Sugar Crash",
    emoji: "☕",
    cuisine: "Café · Dessert",
    blurb: "All of the crash, none of the sugar.",
    eta: "10–18 min",
    rating: 4.7,
    from: [4.895, 52.372],
    to: [4.883, 52.364],
    dishes: [
      { id: "decaf", name: "Decaf Delusion", emoji: "☕", price: 4.5, kcal: 120, desc: "The placebo within the placebo." },
      { id: "croissant", name: "Croissant Voyage", emoji: "🥐", price: 5, kcal: 340, desc: "A thousand buttery layers of not-right-now." },
      { id: "donut", name: "Empty-Calorie Donut", emoji: "🍩", price: 3.5, kcal: 480, desc: "Glazed in pure anticipation." },
      { id: "matcha", name: "Matcha Mirage", emoji: "🍵", price: 5.5, kcal: 220, desc: "Ceremonially whisked into thin air." },
      { id: "cookie", name: "Cookie Placebo (2)", emoji: "🍪", price: 4, kcal: 400, desc: "Warm, gooey, and entirely notional." },
    ],
  },
];

export const FEES = {
  delivery: 2.99,
  service: 1.49,
  tip: 3.0,
};

export function findRestaurant(id: string): Restaurant | undefined {
  return RESTAURANTS.find((r) => r.id === id);
}
