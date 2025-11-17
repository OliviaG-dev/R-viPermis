import { type SVGProps } from "react";

export const TrafficLightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect
      x="10"
      y="4"
      width="12"
      height="24"
      rx="4"
      fill="url(#traffic-body)"
    />
    <circle cx="16" cy="10" r="3" fill="#f87171" />
    <circle cx="16" cy="16" r="3" fill="#fcd34d" />
    <circle cx="16" cy="22" r="3" fill="#34d399" />
    <defs>
      <linearGradient
        id="traffic-body"
        x1="10"
        y1="4"
        x2="22"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#312e81" />
        <stop offset="1" stopColor="#1f2937" />
      </linearGradient>
    </defs>
  </svg>
);
