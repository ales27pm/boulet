import Image from "next/image";

type GuidanceFigureProps = {
  alt: string;
  caption: string;
  className?: string;
  src: string;
};

export function GuidanceFigure({
  alt,
  caption,
  className = "",
  src,
}: GuidanceFigureProps) {
  const classes = ["guidance-figure", className].filter(Boolean).join(" ");

  return (
    <figure className={classes}>
      <Image src={src} alt={alt} width={1536} height={1024} />
      <figcaption>
        <strong>Image générée par IA</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
