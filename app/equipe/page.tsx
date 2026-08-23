import Link from "next/link";
import {
  contactDetails,
  salesTeam,
} from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Notre équipe",
  description:
    "Trouvez le bon contact chez Portes et Fenêtres Boulet selon votre région ou votre besoin.",
  path: "/equipe",
});

export default function TeamPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Équipe</span>
          </nav>
          <h1>
            Un projet avance mieux avec <em>la bonne personne.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            L’équipe de ventes couvre Sorel-Tracy, les rives de Montréal,
            Lanaudière et Trois-Rivières. Choisissez votre contact selon le
            territoire indiqué dans le répertoire officiel.
          </p>
          <div className="button-row">
            <Link className="button button-dark" href="/contact">
              Nous joindre
            </Link>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Répertoire</p>
            <h2>Des contacts directs, par territoire.</h2>
          </div>
          <Link className="text-link" href="/contact">
            Coordonnées et horaire <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="shell checklist">
          {salesTeam.map((member) => (
            <li key={member.email}>
              <strong>{member.name}</strong>
              <p>
                {member.role}
                <br />
                {member.territory}
                <br />
                Poste {member.extension}
              </p>
              <a className="text-link" href={`mailto:${member.email}`}>
                Écrire à {member.name.split(" ")[0]}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section shell">
        <p className="notice" role="note">
          <strong>Besoin d’être dirigé?</strong> Appelez la réception au{" "}
          {contactDetails.phoneDisplay}; l’équipe pourra vous orienter vers le
          bon service.
        </p>
      </section>

      <section className="quote-banner">
        <div className="shell quote-banner-inner">
          <p className="eyebrow eyebrow-light">Parlons de votre projet</p>
          <h2>Commencez avec votre région, vos priorités et votre échéancier.</h2>
          <div className="button-row">
            <Link className="button button-coral" href="/soumission">
              Préparer ma demande <span aria-hidden="true">→</span>
            </Link>
            <a
              className="text-link text-link-light"
              href={contactDetails.phoneHref}
            >
              Appeler au {contactDetails.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
