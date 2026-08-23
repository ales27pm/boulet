import Link from "next/link";
import { Brand } from "./Brand";

const navigation = [
  { href: "/produits", label: "Produits" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/guides", label: "Conseils & guides" },
  { href: "/entreprise", label: "L’entreprise" },
  { href: "/contact", label: "Nous joindre" },
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {navigation.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
      {mobile ? (
        <>
          <Link href="/faq">Questions fréquentes</Link>
          <Link href="/service">Après-vente</Link>
        </>
      ) : null}
    </>
  );
}

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Manufacturier québécois depuis 1976</p>
          <div>
            <Link href="/service">Service après-vente</Link>
            <a href="tel:+14507429424">450 742-9424</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navigation principale">
            <NavigationLinks />
          </nav>
          <div className="header-actions">
            <Link className="button button-compact button-coral" href="/soumission">
              Demander une soumission
            </Link>
            <details className="mobile-menu">
              <summary aria-label="Menu principal">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </summary>
              <nav aria-label="Navigation mobile">
                <NavigationLinks mobile />
                <Link className="button button-coral" href="/soumission">
                  Demander une soumission
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
