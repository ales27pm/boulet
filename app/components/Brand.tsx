import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <Image
        className="brand-logo"
        src="/images/boulet-wordmark.jpg"
        width={1280}
        height={221}
        alt="Boulet"
        sizes="(max-width: 560px) 172px, 240px"
      />
      <span className="sr-only">Portes &amp; fenêtres — Accueil</span>
    </Link>
  );
}
