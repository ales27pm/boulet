import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  variant?: "color" | "reversed";
};

const brandAssets = {
  color: "/images/brand/boulet-wordmark-color.png",
  reversed: "/images/brand/boulet-wordmark-reversed.png",
} as const;

export function Brand({ variant = "color" }: BrandProps) {
  return (
    <Link className={`brand brand-${variant}`} href="/">
      <Image
        className="brand-logo"
        src={brandAssets[variant]}
        width={960}
        height={167}
        sizes="(max-width: 560px) 172px, 240px"
        alt="Boulet"
        unoptimized
      />
      <span className="sr-only">Portes &amp; fenêtres — Accueil</span>
    </Link>
  );
}
