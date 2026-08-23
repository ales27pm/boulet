import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { officialLinks } from "../site-data";

export const metadata: Metadata = {
  title: "Entreprise familiale depuis 1976",
  description:
    "Découvrez l’histoire de Portes et Fenêtres Boulet: une entreprise familiale québécoise de Sorel-Tracy, fabricante depuis 1976.",
};

const timeline = [
  {
    year: "1976",
    title: "Eddy Boulet fonde l’entreprise",
    copy: "Avec son expérience dans la vente de portes et fenêtres, Eddy Boulet lance une entreprise familiale à Sorel-Tracy. Ses fils Roger puis Louis le rejoignent dans l’aventure.",
  },
  {
    year: "1994",
    title: "Repartir après l’incendie",
    copy: "Une nuit d’octobre, l’usine et son équipement sont détruits. La famille choisit immédiatement de reconstruire dans le parc industriel de Sorel-Tracy.",
  },
  {
    year: "1995",
    title: "Quatre mois pour rouvrir",
    copy: "La nouvelle usine reprend ses activités dès février. La croissance mène ensuite à de nouveaux équipements, entrepôts et à un atelier de peinture agrandi.",
  },
  {
    year: "Aujourd’hui",
    title: "Trois générations, une même exigence",
    copy: "Plus de 120 membres d’équipe et plus de 100 000 pieds carrés soutiennent la fabrication, le développement de produits et le service aux clients.",
  },
];

export default function CompanyPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>L’entreprise</span>
          </nav>
          <h1>
            Bâtie ici. <em>Rebâtie ici. Toujours ici.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Une entreprise familiale ne traverse pas trois générations par
            nostalgie. Elle le fait en transmettant l’exigence, en investissant
            dans le métier et en répondant présente après l’installation.
          </p>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell editorial-grid">
          <div>
            <p className="eyebrow">Notre parcours</p>
            <h2>Une histoire de continuité.</h2>
          </div>
          <div className="timeline">
            {timeline.map((item) => (
              <article className="timeline-item" key={item.year}>
                <time>{item.year}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell proof-section" id="garantie">
        <div className="proof-image">
          <Image
            src="/images/realisation-capricor.webp"
            alt="Rénovation d’une maison avec fenêtres Boulet à Trois-Rivières"
            width={1200}
            height={800}
          />
          <p>Capricor · Trois-Rivières</p>
        </div>
        <div className="proof-copy">
          <p className="eyebrow">La relation continue après la pose</p>
          <h2>Une garantie lisible, un service identifiable.</h2>
          <p>
            Les périodes varient selon le produit, la composante, l’usage et la
            conformité de l’installation. Le document complet demeure la seule
            référence contractuelle; notre équipe après-vente vous aide à
            préparer une demande avec les bonnes pièces.
          </p>
          <div className="assurance-grid">
            <div>
              <strong>25 ans</strong>
              <span>Certaines extrusions PVC et aluminium de fenêtres*</span>
            </div>
            <div>
              <strong>1 an</strong>
              <span>Main-d’œuvre incluse pour les travaux couverts*</span>
            </div>
          </div>
          <p className="fine-print">
            * Résumé indicatif. Consultez toutes les conditions et exclusions.
          </p>
          <div className="button-row">
            <a className="text-link" href={officialLinks.warranty}>
              Lire la garantie complète <span aria-hidden="true">↗</span>
            </a>
            <Link className="text-link" href="/service">
              Préparer une demande de service <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Salle de montre et conseils</p>
            <h2>Venez voir, toucher, comparer.</h2>
          </div>
        </div>
        <div className="shell contact-grid">
          <article className="contact-card accent-card">
            <span>01</span>
            <div>
              <h2>Sorel-Tracy</h2>
              <p>
                10700, route Marie-Victorin
                <br />
                Sorel-Tracy, Québec J3R 0K2
              </p>
            </div>
            <a className="button button-light" href={officialLinks.maps}>
              Ouvrir dans Google Maps
            </a>
          </article>
          <article className="contact-card">
            <span>02</span>
            <div>
              <h2>Horaire</h2>
              <p>
                Lundi au jeudi: 8 h–12 h et 13 h–16 h 30
                <br />
                Vendredi: 8 h–12 h et 13 h–16 h
                <br />
                Samedi et dimanche: fermé
              </p>
            </div>
            <a className="text-link" href="tel:+14507429424">
              Appeler avant de vous déplacer <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
