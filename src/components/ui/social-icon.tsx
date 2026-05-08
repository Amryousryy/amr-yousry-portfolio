interface SocialIconProps {
  icon: 'wa' | 'ig' | 'be' | 'fb' | 'in' | 'em';
  size?: number;
  className?: string;
}

const iconMap = {
  wa: "/images/social/whatsapp-pixel-v2.png",
  em: "/images/social/email-pixel-v2.png",
  ig: "/images/social/instagram-pixel-v2.png",
  be: "/images/social/behance-pixel-v2.png",
  fb: "/images/social/facebook-pixel-v2.png",
  in: "/images/social/linkedin-pixel-v2.png",
};

export default function SocialIcon({ icon, size = 52, className = '' }: SocialIconProps) {
  const src = iconMap[icon];

  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`block object-contain image-pixel ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}
