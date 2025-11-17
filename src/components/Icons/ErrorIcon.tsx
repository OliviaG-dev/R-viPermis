import { type SVGProps } from "react";

export const ErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#f87171" opacity="0.15" />
    <path
      d="M9 9l6 6M15 9l-6 6"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

