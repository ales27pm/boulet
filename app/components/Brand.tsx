import { SiteLink as Link } from "./SiteLink";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark" aria-hidden="true">
        <span>B</span>
      </span>
      <span className="brand-copy">
        <strong>Boulet</strong>
        <small>Portes &amp; fenêtres</small>
      </span>
      <span className="sr-only"> — Accueil</span>
    </Link>
  );
}
