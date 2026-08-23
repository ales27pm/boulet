import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

export type MediaRole =
  | "inspiration"
  | "guidance"
  | "project"
  | "project-detail"
  | "factual";

type MediaFrameProps = {
  alt: string;
  caption?: ReactNode;
  className?: string;
  height: number;
  mediaRole: MediaRole;
  priority?: boolean;
  sizes?: string;
  src: string | StaticImageData;
  width: number;
};

export function MediaFrame({
  alt,
  caption,
  className = "",
  height,
  mediaRole,
  priority = false,
  sizes,
  src,
  width,
}: MediaFrameProps) {
  const classes = ["media-frame", `media-frame--${mediaRole}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={classes}>
      <div className="media-frame__viewport">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
