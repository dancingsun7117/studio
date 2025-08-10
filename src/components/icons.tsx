import type { SVGProps } from 'react';

export function MafiaSealIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="m14.2 14.2 4.3 4.3" />
      <path d="m5.5 5.5 4.3 4.3" />
      <path d="m5.5 18.5 4.3-4.3" />
      <path d="m18.5 5.5-4.3 4.3" />
      <path d="M12 8V5" />
      <path d="M12 19v-3" />
      <path d="M16 12h3" />
      <path d="M5 12h3" />
    </svg>
  );
}
