import Link from "next/link";
import { officialLinks } from "../site-data";
import { Brand } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-lead">
          <Brand />
          <p>
            Fabrication, distribution et installation de portes et fenêtres à
            Sorel-Tracy, en Montérégie et dans les régions desservies.
          </p>
        </div>
        <div>
          <p className="footer-heading">Explorer</p>
          <Link href="/produits">Produits</Link>
          <Link href="/realisations">Réalisations</Link>
          <Link href="/vente-entrepot">Vente d’entrepôt</Link>
          <Link href="/visite-virtuelle">Visite virtuelle</Link>
        </div>
        <div>
          <p className="footer-heading">Comprendre</p>
          <Link href="/conseils">Bien choisir</Link>
          <Link href="/guides">Guides pratiques</Link>
          <Link href="/faq">Questions fréquentes</Link>
          <Link href="/subventions">Aide financière</Link>
          <Link href="/blogue">Blogue</Link>
        </div>
        <div>
          <p className="footer-heading">Boulet</p>
          <Link href="/entreprise">Notre histoire</Link>
          <Link href="/equipe">Notre équipe</Link>
          <Link href="/carrieres">Carrières</Link>
          <Link href="/contact">Nous joindre</Link>
        </div>
        <div>
          <p className="footer-heading">Votre projet</p>
          <Link href="/soumission">Préparer une soumission</Link>
          <Link href="/service">Service après-vente</Link>
          <Link href="/garantie">Garantie détaillée</Link>
          <Link href="/confidentialite">Vie privée</Link>
        </div>
        <div>
          <p className="footer-heading">Nous joindre</p>
          <a href="tel:+14507429424">450 742-9424</a>
          <a href="mailto:info@fenetresboulet.com">info@fenetresboulet.com</a>
          <a href={officialLinks.instagram}>Instagram · @fenetresboulet</a>
          <a href={officialLinks.maps}>
            10700, route Marie-Victorin
            <br />
            Sorel-Tracy, QC J3R 0K2
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} Portes et Fenêtres Boulet</p>
        <p>
          Licence RBQ 8246-5071-36 ·{" "}
          <Link href="/confidentialite">Mentions légales</Link> ·{" "}
          <Link href="/credits">Crédits</Link>
        </p>
      </div>
    </footer>
  );
}
