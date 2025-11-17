import { type SVGProps } from "react";

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="9" r="1.5" fill="#ef4444" />
    <circle cx="12" cy="9" r="1.5" fill="#f59e0b" />
    <circle cx="16" cy="9" r="1.5" fill="#10b981" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

