type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Apple = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
    <path d="M16.37 12.62c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.65l.04-.03ZM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.05-.52 2.68-1.28Z" />
  </svg>
);
export const GitHub = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49A10.1 10.1 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
  </svg>
);
export const Arrow = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} strokeWidth={3} className={p.className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const Displays = (p: P) => (
  <svg {...base} className={p.className}>
    <rect x="2" y="4" width="13" height="9" rx="1.5" />
    <rect x="9" y="9" width="13" height="9" rx="1.5" fill="var(--bg, #fff)" />
    <path d="M13 21h5" />
  </svg>
);
export const Display = (p: P) => (
  <svg {...base} className={p.className}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16v4" />
  </svg>
);
export const Laptop = (p: P) => (
  <svg {...base} className={p.className}>
    <rect x="4" y="5" width="16" height="11" rx="1.5" />
    <path d="M2 19h20" />
  </svg>
);
export const SunLow = (p: P) => (
  <svg {...base} className={p.className}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 5v1M12 18v1M5 12h1M18 12h1M7 7l.7.7M16.3 16.3l.7.7M7 17l.7-.7M16.3 7.7l.7-.7" />
  </svg>
);
export const Sun = (p: P) => (
  <svg {...base} className={p.className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
  </svg>
);
export const Plug = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5" />
  </svg>
);
export const Power = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M12 3v8M6.4 6.4a8 8 0 1 0 11.2 0" />
  </svg>
);
export const Terminal = (p: P) => (
  <svg {...base} className={p.className}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
);
export const Resize = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);
export const Pin = (p: P) => (
  <svg {...base} className={p.className}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <path d="M17 14v6M14 17h6" />
  </svg>
);
export const Shield = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3Z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);
export const Bolt = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);
export const Moon = (p: P) => (
  <svg {...base} className={p.className}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
