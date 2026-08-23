import Link from "next/link";
import {
  contactDetails,
  editorialOfficialLinks,
} from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Nous joindre",
  description:
    "Téléphone, courriel, adresse et options de visite pour joindre Portes et Fenêtres Boulet à Sorel-Tracy.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <h1>
            Choisissez le chemin <em>le plus simple.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Une question générale, un projet à cadrer ou une visite à planifier?
            Voici les coordonnées publiées par Boulet et les parcours adaptés à
            chaque besoin.
          </p>
          <div className="button-row">
            <a className="button button-dark" href={contactDetails.phoneHref}>
              Appeler au {contactDetails.phoneDisplay}
            </a>
          </div>
        </div>
      </header>

      <section className="section page-band">
        <div className="shell contact-grid">
          <article className="contact-card accent-card">
            <span>Conversation directe</span>
            <div>
              <h2>Téléphone</h2>
              <p>
                Pour une orientation rapide, appelez la réception. Télécopieur :{" "}
                {contactDetails.faxDisplay}.
              </p>
            </div>
            <a className="button button-light" href={contactDetails.phoneHref}>
              {contactDetails.phoneDisplay}
            </a>
          </article>
          <article className="contact-card">
            <span>Question générale</span>
            <div>
              <h2>Courriel</h2>
              <p>
                Décrivez brièvement votre demande afin qu’elle soit dirigée vers
                la bonne personne.
              </p>
            </div>
            <a
              className="text-link"
              href={`mailto:${contactDetails.email}`}
            >
              {contactDetails.email}
            </a>
          </article>
          <article className="contact-card">
            <span>Salle de montre</span>
            <div>
              <h2>Sorel-Tracy</h2>
              <p>{contactDetails.address}</p>
            </div>
            <a className="text-link" href={editorialOfficialLinks.maps}>
              Ouvrir dans Google Maps <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article className="contact-card">
            <span>À distance</span>
            <div>
              <h2>Visite virtuelle</h2>
              <p>
                Parcourez la salle de montre en ligne, puis notez les éléments que
                vous voulez comparer avec un conseiller.
              </p>
            </div>
            <Link className="text-link" href="/visite-virtuelle">
              Commencer la visite <span aria-hidden="true">→</span>
            </Link>
          </article>
          <article className="contact-card" id="horaire">
            <span>Avant de venir</span>
            <div>
              <h2>Horaire de la salle de montre</h2>
              <p>
                Lundi au jeudi: 8 h–12 h et 13 h–16 h 30
                <br />
                Vendredi: 8 h–12 h et 13 h–16 h
                <br />
                Samedi et dimanche: fermé
              </p>
            </div>
            <a className="text-link" href={contactDetails.phoneHref}>
              Confirmer avant de vous déplacer <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Le bon parcours</p>
            <h2>Un raccourci selon votre demande.</h2>
          </div>
          <Link className="text-link" href="/equipe">
            Trouver le bon contact <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="service-grid">
          <article className="service-card">
            <span>Nouveau projet</span>
            <div>
              <h2>Soumission</h2>
              <p>Préparez les informations utiles avant d’ouvrir le formulaire.</p>
            </div>
            <Link className="button button-dark" href="/soumission">
              Préparer ma demande
            </Link>
          </article>
          <article className="service-card">
            <span>Produit Boulet existant</span>
            <div>
              <h2>Après-vente</h2>
              <p>Rassemblez facture, description et photos du problème.</p>
            </div>
            <Link className="button button-dark" href="/service">
              Préparer mon dossier
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
