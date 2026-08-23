import { MediaFrame } from "./MediaFrame";

type GuidanceFigureProps = {
  alt: string;
  caption: string;
  className?: string;
  sizes?: string;
  src: string;
};

export function GuidanceFigure({
  alt,
  caption,
  className = "",
  sizes = "(max-width: 820px) 90vw, 42vw",
  src,
}: GuidanceFigureProps) {
  return (
    <MediaFrame
      alt={alt}
      className={["guidance-figure", className].filter(Boolean).join(" ")}
      height={1024}
      mediaRole="guidance"
      sizes={sizes}
      src={src}
      width={1536}
      caption={
        <>
          <strong>Mise en situation</strong>
          <span>{caption}</span>
        </>
      }
    />
  );
}
