import { SiteLink as Link } from "./components/SiteLink";

export default function NotFound() {
  return (
    <main className="not-found shell" id="contenu">
      <p className="eyebrow">Cette ouverture ne mène nulle part</p>
      <h1>404</h1>
      <p>La page demandée a été déplacée ou n’existe plus.</p>
      <div className="button-row">
        <Link className="button button-dark" href="/">
          Revenir à l’accueil
        </Link>
        <Link className="text-link" href="/produits">
          Voir les produits <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
