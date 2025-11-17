import { type SVGProps } from "react";

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15" />
    <path
      d="M8 12.5l2.5 2.5L16 9"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

