import { catalogProducts } from "../app/catalog-data";

const permanentRedirects = new Map<string, string>([
  ["/2-accueil", "/"],
  ["/index", "/"],
  ["/13-fenetres", "/produits/fenetres"],
  ["/14-portes", "/produits/portes-entree"],
  ["/15-portes-patio", "/produits/portes-patio"],
  ["/16-portes-de-garage", "/produits/portes-garage"],
  ["/18-battant-manivelle", "/produits/fenetres?type=Battant%20%28manivelle%29"],
  ["/19-portes-d-acier", "/produits/portes-entree?type=Portes%20d%27acier"],
  ["/21-tout-pvc", "/produits/portes-patio?type=Tout-PVC"],
  ["/22-aluminium", "/produits/portes-patio?type=Aluminium"],
  ["/23-hybride", "/produits/portes-patio?type=Hybride"],
  ["/24-vitres-de-porte", "/produits/portes-entree?type=Vitres%20de%20porte"],
  ["/25-serrures", "/produits/portes-entree"],
  ["/26-coulissant", "/produits/fenetres?type=Coulissant"],
  ["/27-guillotine", "/produits/fenetres?type=Guillotine"],
  ["/28-auvent", "/produits/fenetres?type=Auvent"],
  ["/30-realisations", "/realisations"],
  ["/32-vente-d-entrepot", "/vente-entrepot"],
  ["/content/2-garantie", "/garantie"],
  ["/content/3-notre-equipe", "/equipe"],
  ["/content/4-historique", "/entreprise"],
  ["/content/5-carriere", "/carrieres"],
  ["/content/6-visite-virtuelle", "/visite-virtuelle"],
  ["/content/9-faq", "/faq"],
  ["/content/10-conseils-et-astuces", "/guides#entretien"],
  ["/content/11-echobattant", "/produits/fenetres?type=Battant%20%28manivelle%29"],
  ["/content/12-installation-dune-fenetre", "/guides#installation"],
  ["/content/14-subventions-gouvernementales", "/subventions"],
  ["/content/15-nos-realisations", "/realisations"],
  ["/content/16-contactez-nous-maintenant", "/contact"],
  ["/content/17-credits-medias-utilises", "/credits"],
  ["/content/18-blogue-boulet-portes-et-fenetres", "/blogue"],
  [
    "/content/19-protection-des-renseignements-personnels-et-mentions-legales",
    "/confidentialite",
  ],
  [
    "/content/20-guide-d-achat-des-fenetres-et-portes-d-entree-en-acier-boulet",
    "/conseils",
  ],
  ["/magasins", "/contact#horaire"],
  ["/connexion", "/contact"],
  ["/contact-form/demande-de-soumission", "/soumission"],
  ["/contact-form/formulaire-de-sav", "/service"],
  ["/contact-form/service-apres-vente", "/service"],
  [
    "/realisations/97-projet-boulet-christian-laliberte.html",
    "/realisations",
  ],
  ["/portes-d-acier/1-brixton.html", "/produits/portes-entree"],
  [
    "/img/cms/Conseils_et_Astuces_dEntretien_Boulet.pdf",
    "/documents/conseils-entretien-boulet.pdf",
  ],
  [
    "/img/cms/1-%20guide_chantier_fenetres.pdf",
    "/documents/guide-installation-fenetres-apchq-avfq-2015.pdf",
  ],
  [
    "/boulet/politique_protection_des_renseignements_personnel_complete.html",
    "/documents/politique-protection-renseignements-personnels-boulet.pdf",
  ],
  [
    "/boulet/politique_protection_des_renseignements_personnel_resume.html",
    "/documents/resume-politique-protection-renseignements-personnels-boulet.pdf",
  ],
]);

for (const product of catalogProducts) {
  permanentRedirects.set(
    product.legacyPath,
    `/produits/${product.family}/${product.slug}`,
  );
}

function normalizedPath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export function resolveLegacyRedirect(url: URL): URL | null {
  const pathname = normalizedPath(url.pathname);
  const destination =
    permanentRedirects.get(pathname) ??
    (pathname.startsWith("/vente-d-entrepot/")
      ? "/vente-entrepot"
      : pathname.startsWith("/serrures/")
        ? "/produits/portes-entree"
        : undefined);
  if (!destination) return null;

  return new URL(destination, url.origin);
}

export const legacyRedirectCount = permanentRedirects.size;
