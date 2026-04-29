import { SVGProps } from "react";

interface PixelIconProps extends SVGProps<SVGSVGElement> {
  name: "menu" | "close" | "play" | "edit";
  size?: 16 | 24;
  color?: string;
}

const iconPaths = {
  menu: {
    16: "M2,4 h12 M2,8 h12 M2,12 h12",
    24: "M4,6 h16 M4,12 h16 M4,18 h16",
  },
  close: {
    16: "M4,4 l8,8 M12,4 l-8,8",
    24: "M6,6 l12,12 M18,6 l-12,12",
  },
  play: {
    16: "M4,2 l10,6 l-10,6 z",
    24: "M6,3 l14,9 l-14,9 z",
  },
  edit: {
    16: "M10,2 l4,4 l-8,8 l-4,-4 z M6,14 l8,0",
    24: "M14,3 l6,6 l-12,12 l-6,-6 z M9,21 l12,0",
  },
};

export default function PixelIcon({
  name,
  size = 16,
  color = "#00ffcc",
  className = "",
  ...props
}: PixelIconProps) {
  const viewBox = size === 16 ? "0 0 16 16" : "0 0 24 24";
  const path = iconPaths[name][size];

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
}
