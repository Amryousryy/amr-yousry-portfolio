import Image from "next/image";

interface ContactIconImageProps {
  src: string;
  alt?: string;
  wrapperSize: number;
  scale?: number;
  className?: string;
  imgClassName?: string;
}

export default function ContactIconImage({
  src,
  alt = "",
  wrapperSize,
  scale = 1.25,
  className = "",
  imgClassName = "",
}: ContactIconImageProps) {
  const inner = Math.round(wrapperSize * scale);

  return (
    <div
      className={`overflow-hidden flex items-center justify-center shrink-0 ${className}`}
      style={{ width: wrapperSize, height: wrapperSize }}
    >
      <Image
        src={src}
        alt={alt}
        width={inner}
        height={inner}
        className={`block image-pixel ${imgClassName}`}
        style={{
          maxWidth: "none",
          imageRendering: "pixelated",
        }}
        unoptimized
      />
    </div>
  );
}
