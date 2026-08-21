import Image from "next/image";
import { SiteLink as Link } from "./SiteLink";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <Image
        className="brand-logo"
        src="/images/boulet-wordmark.jpg"
        width={1280}
        height={221}
        alt="Boulet"
        unoptimized
      />
      <span className="sr-only">Portes &amp; fenêtres — Accueil</span>
    </Link>
  );
}
