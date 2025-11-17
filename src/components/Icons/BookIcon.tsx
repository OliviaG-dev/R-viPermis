import { type SVGProps } from "react";

export const BookIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M4 19.5c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5h-13C4.7 3 4 3.7 4 4.5v15z" />
    <path d="M8 8h8M8 12h8M8 16h6" />
    <path d="M6 3v18" strokeWidth="1.5" />
  </svg>
);

