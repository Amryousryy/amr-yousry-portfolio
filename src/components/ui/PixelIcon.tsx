import { SVGProps } from "react";

interface PixelIconProps extends SVGProps<SVGSVGElement> {
  name: "menu" | "close" | "play" | "edit";
  size?: 16 | 24;
  color?: string;
}

const pixelIcons = {
  menu: {
    16: [
      [2, 3, 14, 3], // top line
      [2, 8, 14, 8], // middle line
      [2, 13, 14, 13], // bottom line
    ],
    24: [
      [4, 5, 20, 5],
      [4, 12, 20, 12],
      [4, 19, 20, 19],
    ],
  },
  close: {
    16: [
      [3, 3, 13, 13], // diagonal \
      [13, 3, 3, 13], // diagonal /
    ],
    24: [
      [5, 5, 19, 19],
      [19, 5, 5, 19],
    ],
  },
  play: {
    16: [
      [3, 2, 3, 14], // left edge
      [3, 2, 13, 8], // top diagonal
      [3, 14, 13, 8], // bottom diagonal
    ],
    24: [
      [4, 3, 4, 21],
      [4, 3, 20, 12],
      [4, 21, 20, 12],
    ],
  },
  edit: {
    16: [
      [9, 2, 14, 7], // top-right box
      [1, 7, 9, 14], // main diagonal
      [1, 14, 5, 14], // bottom line
    ],
    24: [
      [13, 3, 21, 11],
      [3, 11, 13, 21],
      [3, 21, 7, 21],
    ],
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
  const lines = pixelIcons[name][size];

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={className}
      {...props}
    >
      {lines.map((line: number[], i: number) => (
        <line
          key={i}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
