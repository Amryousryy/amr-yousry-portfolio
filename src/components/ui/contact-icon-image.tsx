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
      <img
        src={src}
        alt={alt}
        className={`block image-pixel ${imgClassName}`}
        style={{
          width: inner,
          height: inner,
          maxWidth: "none",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
