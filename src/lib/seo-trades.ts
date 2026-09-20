export type TradePage = {
  slug: string;
  name: string;
  nameFr: string;
  job: string;
  photo: string;
  title: string;
  description: string;
  h1: string;
  body: string[];
  queries: string[];
};

export const TRADES: TradePage[] = [
  {
    slug: "roofing",
    name: "Roofers",
    nameFr: "Couvreurs",
    job: "roofing",
    photo: "/photos/house.jpg",
    title: "Roofing deposit software — get paid before you climb",
    description:
      "Send a roofing quote with a deposit link. Card or Interac. Canada and the US. No more starting a roof unpaid.",
    h1: "Get the roofing deposit before the first shingle.",
    body: [
      "A roof quote sits in an inbox for a week. Then they want you on the ladder Monday. DevisPay puts a 30% deposit on that quote so the truck only rolls when it’s paid.",
      "Text or WhatsApp the link. They pay like a bill. You print the receipt for the job folder.",
    ],
    queries: [
      "roofing deposit before work",
      "collect roofing deposit Canada",
      "roofer quote payment link",
    ],
  },
  {
    slug: "plumbing",
    name: "Plumbers",
    nameFr: "Plombiers",
    job: "plumbing",
    photo: "/photos/plumber-work.jpg",
    title: "Plumber deposit software — Interac or card, before you open the van",
    description:
      "Send a plumbing quote. Collect a deposit by Interac or card. Built for Canada and the US.",
    h1: "The van doesn’t open until the plumbing deposit is in.",
    body: [
      "Emergency calls still happen. Quoted jobs shouldn’t. Send the estimate, take 25–50% now, start when it clears.",
      "Works in CAD. Interac for the house that won’t use a card. Same cream invoice either way.",
    ],
    queries: [
      "plumber deposit Canada",
      "Interac deposit plumber",
      "plumbing quote pay online",
    ],
  },
  {
    slug: "hvac",
    name: "HVAC",
    nameFr: "CVC",
    job: "HVAC",
    photo: "/photos/van.jpg",
    title: "HVAC deposit software — quote, link, paid, then install",
    description:
      "Furnace and AC quotes with a deposit on Stripe. Card in Canada and the US. Interac in Canada.",
    h1: "Furnace quoted. Deposit taken. Then you install.",
    body: [
      "Equipment sits on a truck that already cost you money. DevisPay is the deposit on the quote so you’re not financing their furnace.",
      "One link. They pay. You get a receipt that shows the balance left on the job.",
    ],
    queries: [
      "HVAC quote deposit",
      "furnace deposit before install",
      "HVAC contractor payment link",
    ],
  },
  {
    slug: "remodeling",
    name: "Remodelers",
    nameFr: "Rénovateurs",
    job: "kitchen and bath remodels",
    photo: "/photos/kitchen-done.jpg",
    title: "Remodel deposit software — phase 1 paid before demo",
    description:
      "Kitchen and bath quotes with a due-now deposit. For remodelers in Canada and the US.",
    h1: "Phase 1 deposit. Then you demo the kitchen.",
    body: [
      "A remodel without an upfront is a loan. Put 30% on the quote. They pay from their phone. You start paid.",
      "Looks like a bill because it is one — not an app they have to download.",
    ],
    queries: [
      "kitchen remodel deposit",
      "contractor deposit before demo",
      "renovation deposit Canada",
    ],
  },
  {
    slug: "electrical",
    name: "Electricians",
    nameFr: "Électriciens",
    job: "electrical",
    photo: "/photos/electrician.jpg",
    title: "Electrician deposit software — paid before the panel",
    description:
      "Electrical quotes with a card or Interac deposit. Canada and the US.",
    h1: "Permit, materials, deposit — then the panel.",
    body: [
      "Materials and a permit shouldn’t float on your Visa. Send the quote with due-now. They pay. You pull stock.",
    ],
    queries: [
      "electrician deposit",
      "electrical quote payment",
      "electrician Interac deposit",
    ],
  },
  {
    slug: "cleaning",
    name: "Cleaners",
    nameFr: "Entretien",
    job: "cleaning and janitorial",
    photo: "/photos/handshake.jpg",
    title: "Cleaning deposit software — first visit paid in advance",
    description:
      "Recurring and one-off cleaning quotes with a deposit link. Card or Interac.",
    h1: "First clean paid before you bring the buckets.",
    body: [
      "No-shows kill a route. Take a deposit on the quote. They show, or you keep the slot paid.",
    ],
    queries: [
      "cleaning deposit booking",
      "janitorial quote payment",
      "house cleaning deposit Canada",
    ],
  },
];

export function tradeBySlug(slug: string) {
  return TRADES.find((t) => t.slug === slug);
}
