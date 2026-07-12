export type Lang = "fr" | "en";

const d = {
  fr: {
    brand: "DevisPay",
    tagline: "Devis → acompte en un lien",
    hero: "Faites payer l'acompte avant de commencer le chantier",
    sub: "Créez un devis professionnel, envoyez un lien. Votre client paie l'acompte par carte. Vous êtes payé avant d'acheter le matériel.",
    cta: "Essayer gratuitement",
    login: "Connexion",
    dashboard: "Tableau de bord",
  },
  en: {
    brand: "DevisPay",
    tagline: "Estimate → deposit in one link",
    hero: "Get the deposit before you buy materials",
    sub: "Create a professional estimate, send a link. Your customer pays the deposit by card. You get paid before the job starts.",
    cta: "Try free",
    login: "Log in",
    dashboard: "Dashboard",
  },
} as const;

export function t(lang: Lang, key: keyof (typeof d)["fr"]) {
  return d[lang][key];
}
