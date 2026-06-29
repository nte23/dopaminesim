export type Courier = {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  initials: string;
  color: string;
  /** absurd messages surfaced one-by-one while en route */
  texts: string[];
};

export const COURIERS: Courier[] = [
  {
    id: "marco",
    name: "Marco",
    vehicle: "Vespa",
    rating: 4.9,
    initials: "M",
    color: "#ff5a1f",
    texts: [
      "On my way! Your nothing is secured.",
      "Stuck behind a parade of ducks, one sec.",
      "Taking a shortcut through a metaphor.",
      "Almost there — I can smell the absence of food.",
    ],
  },
  {
    id: "lena",
    name: "Lena",
    vehicle: "e-bike",
    rating: 4.8,
    initials: "L",
    color: "#0e7c7b",
    texts: [
      "Picked up your order (it weighs nothing).",
      "A pigeon is escorting me. We're friends now.",
      "Hit every green light. Suspicious.",
      "Pulling onto your block!",
    ],
  },
  {
    id: "deon",
    name: "Deon",
    vehicle: "scooter",
    rating: 5.0,
    initials: "D",
    color: "#7c3aed",
    texts: [
      "Order acquired. Engaging warp speed.",
      "Briefly questioned the nature of reality. Back now.",
      "Your building looks lovely from here.",
      "30 seconds away. Get the door you won't need.",
    ],
  },
  {
    id: "ana",
    name: "Ana",
    vehicle: "hatchback",
    rating: 4.7,
    initials: "A",
    color: "#ff2d9b",
    texts: [
      "Rolling out with your imaginary feast.",
      "Detour: a cat demanded tribute.",
      "GPS insists I'm 'basically there'.",
      "Outside! ...somewhere outside.",
    ],
  },
];

export function pickCourier(seed: number): Courier {
  return COURIERS[Math.abs(seed) % COURIERS.length];
}
