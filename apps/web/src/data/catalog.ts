/*
 * Fully fictional catalog. No real brands, no real logos. Restaurant "logos"
 * are font wordmarks (LogoSpec). Dish photos are fetched at runtime from the
 * Pixabay API via /fauxeats/api/img (with a designed gradient fallback), so
 * there are no bundled images and no licensing concerns in the repo.
 */

import { Beef, Coffee, CupSoda, Fish, Pizza, Soup } from "lucide-react";
import type { Restaurant } from "@/lib/menu-types";

/** Common modifier group reused across items. */
const DRINK_GROUP = {
  id: "drink",
  name: "Add a drink",
  type: "multi" as const,
  hint: "Optional",
  options: [
    { id: "cola", name: "Cola", priceDelta: 2.5, kcalDelta: 210 },
    { id: "lemonade", name: "Lemonade", priceDelta: 2.5, kcalDelta: 180 },
    { id: "water", name: "Sparkling water", priceDelta: 2, kcalDelta: 0 },
  ],
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "pizza-mirage",
    name: "Pizza Mirage",
    logo: { font: "'Lobster', cursive", color: "#e23b2e", bg: "#ffe7e3", icon: Pizza, tagline: "Wood-fired in your imagination" },
    cuisine: "Italian · Pizza",
    tags: ["Pizza", "Italian", "Vegetarian"],
    blurb: "Hand-tossed dough, imaginary toppings.",
    rating: 4.8,
    reviewCount: 1243,
    etaMin: 25,
    etaMax: 40,
    deliveryFee: 2.99,
    minOrder: 12,
    priceLevel: 2,
    busy: true,
    heroQuery: "pizza margherita oven",
    reviews: [
      { name: "Dana R.", stars: 5, text: "Best pizza I never received. The box was warm with possibility." },
      { name: "Theo", stars: 4, text: "Lost a star because it didn't arrive, but honestly that's on me." },
      { name: "Priya", stars: 5, text: "Customized a 12-topping monster. Felt unstoppable. Ate a carrot instead." },
    ],
    sections: [
      {
        id: "build",
        name: "Build your pizza",
        items: [
          {
            id: "byo",
            name: "Build-Your-Own Pizza",
            desc: "Pick a size, a crust, and pile on whatever you'll never taste.",
            basePrice: 9,
            baseKcal: 700,
            imageQuery: "build your own pizza",
            popular: true,
            groups: [
              {
                id: "size",
                name: "Size",
                type: "single",
                required: true,
                defaultIds: ["m"],
                options: [
                  { id: "s", name: 'Personal 9"', priceDelta: 0, kcalDelta: 0 },
                  { id: "m", name: 'Medium 12"', priceDelta: 4, kcalDelta: 420 },
                  { id: "l", name: 'Large 14"', priceDelta: 7, kcalDelta: 760 },
                  { id: "xl", name: 'Family 18"', priceDelta: 11, kcalDelta: 1300 },
                ],
              },
              {
                id: "crust",
                name: "Crust",
                type: "single",
                required: true,
                defaultIds: ["classic"],
                options: [
                  { id: "classic", name: "Classic", kcalDelta: 0 },
                  { id: "thin", name: "Thin & crispy", kcalDelta: -120 },
                  { id: "stuffed", name: "Cheese-stuffed", priceDelta: 2.5, kcalDelta: 360 },
                  { id: "gf", name: "Gluten-free", priceDelta: 2, kcalDelta: -40 },
                ],
              },
              {
                id: "sauce",
                name: "Sauce",
                type: "single",
                required: true,
                defaultIds: ["tomato"],
                options: [
                  { id: "tomato", name: "San Marzano tomato" },
                  { id: "white", name: "Garlic white" },
                  { id: "pesto", name: "Basil pesto", priceDelta: 1 },
                  { id: "bbq", name: "Smoky BBQ" },
                ],
              },
              {
                id: "toppings",
                name: "Toppings",
                type: "multi",
                hint: "Pick as many as you dare",
                max: 10,
                options: [
                  { id: "pepperoni", name: "Pepperoni", priceDelta: 1.5, kcalDelta: 150 },
                  { id: "mushroom", name: "Mushrooms", priceDelta: 1, kcalDelta: 30 },
                  { id: "olives", name: "Black olives", priceDelta: 1, kcalDelta: 45 },
                  { id: "onion", name: "Red onion", priceDelta: 1, kcalDelta: 20 },
                  { id: "pepper", name: "Bell peppers", priceDelta: 1, kcalDelta: 25 },
                  { id: "basil", name: "Fresh basil", priceDelta: 1, kcalDelta: 5 },
                  { id: "ham", name: "Smoked ham", priceDelta: 1.5, kcalDelta: 120 },
                  { id: "pineapple", name: "Pineapple", priceDelta: 1, kcalDelta: 60 },
                  { id: "extracheese", name: "Extra mozzarella", priceDelta: 1.5, kcalDelta: 200 },
                  { id: "chili", name: "Chili flakes", priceDelta: 0.5, kcalDelta: 5 },
                  { id: "anchovy", name: "Anchovies", priceDelta: 1.5, kcalDelta: 50 },
                ],
              },
              {
                id: "dip",
                name: "Dips",
                type: "multi",
                options: [
                  { id: "garlic", name: "Garlic dip", priceDelta: 0.75, kcalDelta: 120 },
                  { id: "ranch", name: "Ranch", priceDelta: 0.75, kcalDelta: 140 },
                  { id: "chili-oil", name: "Chili oil", priceDelta: 0.75, kcalDelta: 90 },
                ],
              },
            ],
          },
          {
            id: "margherita",
            name: "Phantom Margherita",
            desc: "Tomato, mozzarella, and the lingering memory of basil.",
            basePrice: 12.5,
            baseKcal: 1100,
            imageQuery: "margherita pizza",
            groups: [
              {
                id: "size",
                name: "Size",
                type: "single",
                required: true,
                defaultIds: ["m"],
                options: [
                  { id: "m", name: 'Medium 12"' },
                  { id: "l", name: 'Large 14"', priceDelta: 3, kcalDelta: 520 },
                ],
              },
              {
                id: "extras",
                name: "Make it extra",
                type: "multi",
                options: [
                  { id: "burrata", name: "Add burrata", priceDelta: 3, kcalDelta: 280 },
                  { id: "hothoney", name: "Hot honey drizzle", priceDelta: 1.5, kcalDelta: 90 },
                ],
              },
            ],
          },
          {
            id: "garlic-bread",
            name: "Null Garlic Bread",
            desc: "Garlic, butter, void.",
            basePrice: 6.5,
            baseKcal: 600,
            imageQuery: "garlic bread",
            groups: [DRINK_GROUP],
          },
        ],
      },
    ],
  },

  {
    id: "bun-voyage",
    name: "Bun Voyage",
    logo: { font: "'Bebas Neue', sans-serif", color: "#2b2b2b", bg: "#ffe9d6", icon: Beef, tagline: "Have a great trip to nowhere", tracking: "0.06em" },
    cuisine: "Burgers · American",
    tags: ["Burgers", "American"],
    blurb: "Smash patties you'll smash zero of.",
    rating: 4.6,
    reviewCount: 980,
    etaMin: 20,
    etaMax: 35,
    deliveryFee: 1.99,
    minOrder: 10,
    heroQuery: "cheeseburger fries",
    reviews: [
      { name: "Marcus", stars: 5, text: "Built a triple-bacon monster. Felt the cholesterol I'll never have." },
      { name: "Jo", stars: 4, text: "Fries arrived in a different dimension. Smelled amazing through the portal." },
      { name: "Wren", stars: 5, text: "The combo upsell got me. $0 well spent." },
    ],
    sections: [
      {
        id: "burgers",
        name: "Build a burger",
        items: [
          {
            id: "byo-burger",
            name: "Build-Your-Own Burger",
            desc: "Stack it sky-high. Eat absolutely none of it.",
            basePrice: 8.5,
            baseKcal: 520,
            imageQuery: "gourmet burger",
            popular: true,
            groups: [
              {
                id: "patty",
                name: "Patty",
                type: "single",
                required: true,
                defaultIds: ["beef"],
                options: [
                  { id: "beef", name: "Beef smash", kcalDelta: 0 },
                  { id: "double", name: "Double beef", priceDelta: 3, kcalDelta: 300 },
                  { id: "chicken", name: "Crispy chicken", priceDelta: 1, kcalDelta: 120 },
                  { id: "plant", name: "Plant-based", priceDelta: 1.5, kcalDelta: -40 },
                ],
              },
              {
                id: "cheese",
                name: "Cheese",
                type: "single",
                defaultIds: ["cheddar"],
                options: [
                  { id: "none", name: "No cheese" },
                  { id: "cheddar", name: "Cheddar", priceDelta: 1, kcalDelta: 110 },
                  { id: "swiss", name: "Swiss", priceDelta: 1, kcalDelta: 100 },
                  { id: "vegan", name: "Vegan cheese", priceDelta: 1.5, kcalDelta: 80 },
                ],
              },
              {
                id: "toppings",
                name: "Toppings",
                type: "multi",
                options: [
                  { id: "lettuce", name: "Lettuce", priceDelta: 0.5, kcalDelta: 5 },
                  { id: "tomato", name: "Tomato", priceDelta: 0.5, kcalDelta: 10 },
                  { id: "onion", name: "Grilled onion", priceDelta: 0.5, kcalDelta: 40 },
                  { id: "pickles", name: "Pickles", priceDelta: 0.5, kcalDelta: 10 },
                  { id: "bacon", name: "Bacon", priceDelta: 1.5, kcalDelta: 180 },
                  { id: "jalapeno", name: "Jalapeños", priceDelta: 0.5, kcalDelta: 10 },
                  { id: "egg", name: "Fried egg", priceDelta: 1.5, kcalDelta: 90 },
                ],
              },
              {
                id: "sauce",
                name: "Sauces",
                type: "multi",
                options: [
                  { id: "house", name: "House sauce", priceDelta: 0.5, kcalDelta: 80 },
                  { id: "bbq", name: "Smoky BBQ", priceDelta: 0.5, kcalDelta: 60 },
                  { id: "sriracha", name: "Sriracha mayo", priceDelta: 0.5, kcalDelta: 90 },
                ],
              },
              {
                id: "combo",
                name: "Make it a combo",
                type: "single",
                defaultIds: ["none"],
                options: [
                  { id: "none", name: "Just the burger" },
                  { id: "fries", name: "+ Fries & a drink", priceDelta: 4.5, kcalDelta: 690 },
                  { id: "loaded", name: "+ Loaded fries & a shake", priceDelta: 7, kcalDelta: 1100 },
                ],
              },
            ],
          },
          {
            id: "nuggets",
            name: "Air Nuggets (12)",
            desc: "Aerodynamically perfect. Nutritionally theoretical.",
            basePrice: 8,
            baseKcal: 700,
            imageQuery: "chicken nuggets",
            groups: [
              {
                id: "dip",
                name: "Dips",
                type: "multi",
                hint: "Pick up to 3",
                max: 3,
                options: [
                  { id: "ketchup", name: "Ketchup", kcalDelta: 30 },
                  { id: "bbq", name: "BBQ", kcalDelta: 50 },
                  { id: "honey", name: "Honey mustard", priceDelta: 0.5, kcalDelta: 70 },
                  { id: "buffalo", name: "Buffalo", priceDelta: 0.5, kcalDelta: 60 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "wok-and-roll",
    name: "Wok & Roll",
    logo: { font: "'Righteous', sans-serif", color: "#0e7c7b", bg: "#d8f3f2", icon: Soup, tagline: "Stir-fried suspense" },
    cuisine: "Pan-Asian · Noodles",
    tags: ["Asian", "Noodles", "Vegan"],
    blurb: "Wok-tossed nothing, made to order.",
    rating: 4.7,
    reviewCount: 1567,
    etaMin: 25,
    etaMax: 40,
    deliveryFee: 2.49,
    minOrder: 12,
    heroQuery: "noodle stir fry wok",
    reviews: [
      { name: "Kai", stars: 5, text: "Extra spicy tofu bowl. Cried imaginary tears. Worth it." },
      { name: "Sora", stars: 5, text: "The 'extra peanuts' option healed something in me." },
      { name: "Bex", stars: 4, text: "Geese took my noodles. Classic Tuesday." },
    ],
    sections: [
      {
        id: "bowls",
        name: "Build a bowl",
        items: [
          {
            id: "byo-bowl",
            name: "Build-Your-Own Bowl",
            desc: "Base, protein, heat, extras — your imaginary masterpiece.",
            basePrice: 10,
            baseKcal: 600,
            imageQuery: "asian rice bowl",
            popular: true,
            groups: [
              {
                id: "base",
                name: "Base",
                type: "single",
                required: true,
                defaultIds: ["rice"],
                options: [
                  { id: "rice", name: "Jasmine rice" },
                  { id: "noodles", name: "Egg noodles", kcalDelta: 60 },
                  { id: "udon", name: "Udon", priceDelta: 1, kcalDelta: 90 },
                  { id: "zoodles", name: "Zucchini noodles", priceDelta: 1, kcalDelta: -120 },
                ],
              },
              {
                id: "protein",
                name: "Protein",
                type: "single",
                required: true,
                defaultIds: ["tofu"],
                options: [
                  { id: "tofu", name: "Crispy tofu", kcalDelta: 0 },
                  { id: "chicken", name: "Teriyaki chicken", priceDelta: 2, kcalDelta: 160 },
                  { id: "beef", name: "Sizzling beef", priceDelta: 3, kcalDelta: 220 },
                  { id: "shrimp", name: "Garlic shrimp", priceDelta: 3.5, kcalDelta: 130 },
                ],
              },
              {
                id: "spice",
                name: "Spice level",
                type: "single",
                required: true,
                defaultIds: ["medium"],
                hint: "How much imaginary pain do you want?",
                options: [
                  { id: "mild", name: "Mild" },
                  { id: "medium", name: "Medium" },
                  { id: "hot", name: "Hot" },
                  { id: "extra", name: "Volcanic", priceDelta: 0.5, kcalDelta: 10 },
                ],
              },
              {
                id: "addons",
                name: "Add-ons",
                type: "multi",
                options: [
                  { id: "egg", name: "Soft egg", priceDelta: 1.5, kcalDelta: 90 },
                  { id: "veg", name: "Extra veg", priceDelta: 1.5, kcalDelta: 40 },
                  { id: "peanuts", name: "Crushed peanuts", priceDelta: 1, kcalDelta: 120 },
                  { id: "kimchi", name: "Kimchi", priceDelta: 1.5, kcalDelta: 30 },
                ],
              },
            ],
          },
          {
            id: "springrolls",
            name: "Spectral Spring Rolls",
            desc: "Crispy on the outside, absent on the inside.",
            basePrice: 6,
            baseKcal: 410,
            imageQuery: "spring rolls",
            groups: [DRINK_GROUP],
          },
        ],
      },
    ],
  },

  {
    id: "boba-mirage",
    name: "Boba Mirage",
    logo: { font: "'Fredoka', sans-serif", color: "#7c3aed", bg: "#efe4ff", icon: CupSoda, tagline: "Sip the void, hold the boba", weight: 600 },
    cuisine: "Bubble Tea · Dessert",
    tags: ["Bubble Tea", "Drinks", "Vegan"],
    blurb: "Tea, milk, sweetness, ice, boba — your call, every layer.",
    rating: 4.9,
    reviewCount: 2210,
    etaMin: 15,
    etaMax: 28,
    deliveryFee: 1.49,
    minOrder: 6,
    busy: true,
    heroQuery: "bubble tea boba drinks",
    reviews: [
      { name: "Mei", stars: 5, text: "The cup-builder is hypnotic. Made 6 drinks. Drank zero. Perfect." },
      { name: "Sam", stars: 5, text: "Taro + cheese foam + popping boba. A masterpiece nobody will sip." },
      { name: "Ira", stars: 5, text: "0% sweetness, extra everything. Powerful restraint energy." },
    ],
    sections: [
      {
        id: "drinks",
        name: "Customize your cup",
        items: [
          {
            id: "byo-boba",
            name: "Build-Your-Own Bubble Tea",
            desc: "Choose your tea, milk, sweetness, ice, size and toppings.",
            basePrice: 4.5,
            baseKcal: 90,
            imageQuery: "bubble tea taro",
            builder: "boba",
            popular: true,
          },
          {
            id: "classic-milk",
            name: "Classic Milk Tea",
            desc: "Black tea, whole milk, tapioca. A canvas for your tweaks.",
            basePrice: 4.5,
            baseKcal: 90,
            imageQuery: "milk tea boba",
            builder: "boba",
          },
          {
            id: "taro-dream",
            name: "Taro Dream",
            desc: "Creamy taro base — open the builder to make it yours.",
            basePrice: 4.5,
            baseKcal: 90,
            imageQuery: "taro bubble tea",
            builder: "boba",
          },
        ],
      },
    ],
  },

  {
    id: "sushi-limbo",
    name: "Sushi Limbo",
    logo: { font: "'Playfair Display', serif", color: "#1f2a44", bg: "#e6eaf2", icon: Fish, tagline: "Caught fresh from the void", weight: 700 },
    cuisine: "Sushi · Japanese",
    tags: ["Sushi", "Japanese"],
    blurb: "Precision rolls, zero fish harmed.",
    rating: 4.9,
    reviewCount: 845,
    etaMin: 30,
    etaMax: 45,
    deliveryFee: 3.49,
    minOrder: 15,
    priceLevel: 3,
    heroQuery: "sushi platter",
    reviews: [
      { name: "Yuki", stars: 5, text: "The Schrödinger Roll is both eaten and not. Quantum cuisine." },
      { name: "Ravi", stars: 4, text: "Extra wasabi option made me feel alive about nothing." },
      { name: "Tess", stars: 5, text: "Plated beautifully in my imagination." },
    ],
    sections: [
      {
        id: "rolls",
        name: "Rolls",
        items: [
          {
            id: "schrodinger",
            name: "Schrödinger Roll",
            desc: "Simultaneously eaten and not, until you open the box.",
            basePrice: 13,
            baseKcal: 520,
            imageQuery: "sushi roll plate",
            popular: true,
            groups: [
              {
                id: "pieces",
                name: "Pieces",
                type: "single",
                required: true,
                defaultIds: ["p8"],
                options: [
                  { id: "p6", name: "6 pieces", priceDelta: 0, kcalDelta: 0 },
                  { id: "p8", name: "8 pieces", priceDelta: 2, kcalDelta: 130 },
                  { id: "p12", name: "12 pieces", priceDelta: 5, kcalDelta: 320 },
                ],
              },
              {
                id: "extras",
                name: "On the side",
                type: "multi",
                options: [
                  { id: "wasabi", name: "Extra wasabi", priceDelta: 0.5, kcalDelta: 5 },
                  { id: "ginger", name: "Pickled ginger", priceDelta: 0.5, kcalDelta: 15 },
                  { id: "spicymayo", name: "Spicy mayo", priceDelta: 0.75, kcalDelta: 90 },
                  { id: "edamame", name: "Edamame", priceDelta: 3, kcalDelta: 190 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "sugar-crash",
    name: "Sugar Crash",
    logo: { font: "'Pacifico', cursive", color: "#8a5a2b", bg: "#f3e7d8", icon: Coffee, tagline: "All of the crash, none of the sugar" },
    cuisine: "Café · Dessert",
    tags: ["Coffee", "Dessert", "Breakfast"],
    blurb: "Barista-grade beverages, brewed in theory.",
    rating: 4.7,
    reviewCount: 1320,
    etaMin: 12,
    etaMax: 22,
    deliveryFee: 1.99,
    minOrder: 8,
    heroQuery: "latte coffee cafe",
    reviews: [
      { name: "Noa", stars: 5, text: "Oat-milk double shot, no cup. Felt the buzz of anticipation." },
      { name: "Cleo", stars: 4, text: "Donut achieved escape velocity. Saw it leave. Proud of it." },
      { name: "Finn", stars: 5, text: "Matcha mirage: greener than my real life choices." },
    ],
    sections: [
      {
        id: "coffee",
        name: "Coffee",
        items: [
          {
            id: "latte",
            name: "Custom Latte",
            desc: "Your size, your milk, your syrups — sipped never.",
            basePrice: 4,
            baseKcal: 120,
            imageQuery: "latte art coffee",
            popular: true,
            groups: [
              {
                id: "size",
                name: "Size",
                type: "single",
                required: true,
                defaultIds: ["m"],
                options: [
                  { id: "s", name: "Small" },
                  { id: "m", name: "Medium", priceDelta: 0.5, kcalDelta: 40 },
                  { id: "l", name: "Large", priceDelta: 1, kcalDelta: 90 },
                ],
              },
              {
                id: "milk",
                name: "Milk",
                type: "single",
                required: true,
                defaultIds: ["whole"],
                options: [
                  { id: "whole", name: "Whole" },
                  { id: "oat", name: "Oat", priceDelta: 0.5, kcalDelta: 20 },
                  { id: "almond", name: "Almond", priceDelta: 0.5, kcalDelta: -10 },
                  { id: "soy", name: "Soy", priceDelta: 0.5 },
                ],
              },
              {
                id: "syrup",
                name: "Syrups",
                type: "multi",
                hint: "Pick up to 3",
                max: 3,
                options: [
                  { id: "vanilla", name: "Vanilla", priceDelta: 0.5, kcalDelta: 60 },
                  { id: "caramel", name: "Caramel", priceDelta: 0.5, kcalDelta: 70 },
                  { id: "hazelnut", name: "Hazelnut", priceDelta: 0.5, kcalDelta: 65 },
                  { id: "pumpkin", name: "Pumpkin spice", priceDelta: 0.75, kcalDelta: 80 },
                ],
              },
              {
                id: "shot",
                name: "Extra shots",
                type: "single",
                defaultIds: ["x0"],
                options: [
                  { id: "x0", name: "None" },
                  { id: "x1", name: "+1 shot", priceDelta: 0.8 },
                  { id: "x2", name: "+2 shots", priceDelta: 1.6 },
                ],
              },
            ],
          },
          {
            id: "donut",
            name: "Empty-Calorie Donut",
            desc: "Glazed in pure anticipation.",
            basePrice: 3.5,
            baseKcal: 480,
            imageQuery: "glazed donut",
            groups: [],
          },
        ],
      },
    ],
  },
];

export function findRestaurant(id: string): Restaurant | undefined {
  return RESTAURANTS.find((r) => r.id === id);
}

export function allItems(r: Restaurant) {
  return r.sections.flatMap((s) => s.items);
}

export function findItem(r: Restaurant, itemId: string) {
  return allItems(r).find((i) => i.id === itemId);
}
