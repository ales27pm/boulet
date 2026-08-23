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
          <Link href="/conseils">Guide d’achat</Link>
          <Link href="/entreprise">Notre histoire</Link>
        </div>
        <div>
          <p className="footer-heading">Votre projet</p>
          <Link href="/soumission">Préparer une soumission</Link>
          <Link href="/service">Service après-vente</Link>
          <a href={officialLinks.warranty}>Garantie détaillée</a>
          <a href={officialLinks.privacy}>Vie privée et mentions légales</a>
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
        <p>Licence RBQ 8246-5071-36</p>
      </div>
    </footer>
  );
}
