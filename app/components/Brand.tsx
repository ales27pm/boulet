import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <Image
        className="brand-logo"
        src="/images/boulet-wordmark-480.webp"
        width={480}
        height={83}
        alt="Boulet"
        unoptimized
      />
      <span className="sr-only">Portes &amp; fenêtres — Accueil</span>
    </Link>
  );
}
