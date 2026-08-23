import Link from "next/link";
import { contactDetails } from "../editorial-data";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Protection des renseignements personnels",
  description:
    "Résumé des engagements de Portes et Fenêtres Boulet en matière de collecte, d’utilisation et de protection des renseignements personnels.",
  path: "/confidentialite",
});

const privacyPrinciples = [
  {
    title: "Une finalité annoncée",
    copy: "La politique indique que Boulet détermine les fins de la collecte et limite les renseignements recueillis à ce qui est nécessaire pour ces fins.",
  },
  {
    title: "Utilisation et consentement",
    copy: "Les renseignements sont utilisés ou communiqués pour les fins annoncées, avec le consentement applicable ou lorsque la loi le permet ou l’exige.",
  },
  {
    title: "Fournisseurs encadrés",
    copy: "Lorsque des fournisseurs traitent des renseignements pour Boulet, la politique prévoit des mesures contractuelles et une utilisation limitée au mandat confié.",
  },
  {
    title: "Sécurité et accès limité",
    copy: "Boulet affirme prendre des mesures raisonnables contre la perte, le vol et l’accès non autorisé, et limiter l’accès aux personnes dont les fonctions le requièrent.",
  },
  {
    title: "Conservation proportionnée",
    copy: "Les renseignements sont conservés pendant la période nécessaire aux fins de leur collecte ou selon les exigences de la loi, puis détruits ou anonymisés lorsque permis.",
  },
  {
    title: "Accès et rectification",
    copy: "La politique prévoit des droits d’accès et de correction, sous réserve des restrictions permises par la loi.",
  },
];

const nativeFormProcessing = [
  {
    title: "Données demandées",
    copy: "Coordonnées, adresse du projet ou du produit, description de la demande et, lorsque vous les joignez, photographies JPEG ou PNG. Les PDF sont refusés tant qu’une analyse antimalware n’est pas activée.",
  },
  {
    title: "Finalité",
    copy: "Préparer, analyser et traiter une demande de soumission ou de service après-vente. Les renseignements ne servent pas à établir un profil marketing sur ce site.",
  },
  {
    title: "Stockage et accès",
    copy: "Lorsque le service est activé, les fiches sont stockées dans une base privée D1 et les images dans un compartiment R2 privé. L’accès exige une identité authentifiée et une adresse inscrite dans la liste administrative Boulet.",
  },
  {
    title: "Conservation",
    copy: "Le système est configuré pour faire expirer un brouillon après 24 heures et une demande finalisée avec ses fichiers après 90 jours. Le déclencheur de purge doit être vérifié avant l’activation publique; une conservation distincte peut rester nécessaire au traitement du dossier ou selon la loi.",
  },
  {
    title: "Prévention des abus",
    copy: "Le serveur exige Turnstile et applique des limites de fréquence au moyen d’une empreinte irréversible dérivée de l’adresse réseau. Cette donnée technique est nettoyée après la courte fenêtre de contrôle.",
  },
  {
    title: "Limites actuelles",
    copy: "La collecte demeure coupée par défaut, et aucune confirmation automatique n’est envoyée par courriel. L’infrastructure Cloudflare utilisée par ce déploiement ne garantit pas une résidence exclusivement canadienne; ce point doit être évalué avant l’ouverture publique.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Confidentialité</span>
          </nav>
          <h1>
            Vos renseignements méritent <em>un cadre clair.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Cette page présente les grands principes publiés par Portes et
            Fenêtres Boulet. Pour connaître les définitions, exceptions et
            obligations complètes, consultez la copie locale de la politique
            intégrale.
          </p>
          <div className="button-row">
            <a
              className="button button-dark"
              href="/documents/politique-protection-renseignements-personnels-boulet.pdf"
            >
              Lire la politique complète en PDF{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="section-heading-note">
            Copie de la version publiée par Boulet et consultée le 23 août 2026.
          </p>
        </div>
      </header>

      <section className="section shell" aria-labelledby="native-forms-title">
        <div className="section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Formulaires de ce redesign</p>
            <h2 id="native-forms-title">Un traitement défini, et limité.</h2>
          </div>
          <p className="section-heading-note">
            Ces modalités décrivent le flux natif de soumission et d’après-vente
            préparé pour ce site.
          </p>
        </div>
        <ol className="checklist">
          {nativeFormProcessing.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
        <p className="notice" role="note">
          <strong>Retrait ou suppression.</strong> Écrivez à{" "}
          <a href={`mailto:${contactDetails.privacyEmail}`}>
            {contactDetails.privacyEmail}
          </a>{" "}
          en indiquant la référence de la demande, si vous l’avez conservée.
        </p>
      </section>

      <section className="section page-band">
        <div className="shell section-heading horizontal-heading">
          <div>
            <p className="eyebrow">Principes publiés</p>
            <h2>Collecter moins, expliquer pourquoi, protéger mieux.</h2>
          </div>
        </div>
        <ol className="shell checklist">
          {privacyPrinciples.map((principle) => (
            <li key={principle.title}>
              <strong>{principle.title}</strong>
              <p>{principle.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell">
        <div className="service-grid">
          <article className="service-card accent-card">
            <span>Question, demande ou plainte</span>
            <div>
              <h2>Responsable de la protection</h2>
              <p>
                Écrivez à l’adresse publiée pour une demande d’accès, de
                rectification, de retrait du consentement ou toute préoccupation.
              </p>
            </div>
            <a
              className="button button-light"
              href={`mailto:${contactDetails.privacyEmail}`}
            >
              {contactDetails.privacyEmail}
            </a>
          </article>
          <article className="service-card">
            <span>Avant de transmettre un formulaire</span>
            <div>
              <h2>Consulter le résumé</h2>
              <p>
                La politique couvre notamment les visites du site, les demandes
                de soumission, le service après-vente et les interactions avec
                l’établissement Boulet.
              </p>
            </div>
            <a
              className="text-link"
              href="/documents/resume-politique-protection-renseignements-personnels-boulet.pdf"
            >
              Lire le résumé en PDF <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
        <p className="notice" role="note">
          <strong>Dates des documents consultés.</strong> Le résumé indique une
          entrée en vigueur le 22 septembre 2023; l’avis sur les témoins affiche
          une mise à jour au 4 octobre 2023. Boulet peut modifier sa politique :
          vérifiez toujours la version officielle courante.
        </p>
        <div className="button-row">
          <a
            className="text-link"
            href="/documents/mentions-legales-et-temoins-boulet.pdf"
          >
            Mentions légales et avis sur les témoins en PDF{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
