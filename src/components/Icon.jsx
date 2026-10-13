// Minimal 1.5px line icon set (24px grid)
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />,
  bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  clipboard: <><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5h6v2.5H9z" /><path d="M8.5 12h7M8.5 15.5h4.5" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></>,
  menu: <><path d="M4 8h16" /><path d="M4 16h10" /></>,
  close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  arrowLeft: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  filter: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V20H4z" /><path d="M10 20v-5h4v5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  ruler: <><path d="M3.5 15.5 15.5 3.5l5 5-12 12z" /><path d="m7 12 2 2M10 9l2 2M13 6l2 2" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3.5V16h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" /><path d="M5 19 13 11" /></>,
  hammer: <><path d="m14 6 4 4-9.5 9.5a2 2 0 0 1-2.8 0l-1.2-1.2a2 2 0 0 1 0-2.8z" /><path d="m13 4 2-1 6 6-1 2" /></>,
  sparkle: <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />,
  shield: <><path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z" /><path d="m9 12 2 2 4-4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5.5-5 4 3.5 2.5-2 4 3.5" /></>,
  trash: <><path d="M4.5 7h15" /><path d="M9.5 7V4.5h5V7" /><path d="M6.5 7 7.5 20h9l1-13" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" /></>,
  pinterest: <><circle cx="12" cy="12" r="8.5" /><path d="M10.5 20 12.5 11.5" /><path d="M9.3 13.2c-.6-2.6 1-5 3.5-5 2 0 3.2 1.4 3.2 3.2 0 2.3-1.3 4-3 4-1 0-1.6-.7-1.4-1.6" /></>,
  linkedin: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" /></>,
  whatsapp: <><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8 18.4z" /><path d="M9 9.2c.2 2.4 2.4 4.7 5 5l1-1.2-1.6-.9-.8.8a4 4 0 0 1-2.2-2.2l.8-.8-.9-1.6z" /></>,
  sofa: <><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3z" /><path d="M5 17v2M19 17v2" /></>,
  armchair: <><path d="M7 11V7.5A2.5 2.5 0 0 1 9.5 5h5A2.5 2.5 0 0 1 17 7.5V11" /><path d="M4.5 12a1.8 1.8 0 0 1 3.5 0v2h8v-2a1.8 1.8 0 0 1 3.5 0v5h-15z" /><path d="M6.5 17v2M17.5 17v2" /></>,
  bed: <><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /><path d="M3 15h18" /><path d="M5 10V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V10" /><path d="M3 18v2M21 18v2" /></>,
  table: <><path d="M3 8.5h18" /><path d="M5 8.5 6 19M19 8.5 18 19M8 8.5v5h8v-5" /></>,
  chair: <><path d="M7 4h10l-1 7H8z" /><path d="M6 11h12v2H6z" /><path d="M7 13l-1 7M17 13l1 7" /></>,
  wardrobe: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M12 3v18M10 11v2M14 11v2" /></>,
  storage: <><rect x="3" y="7" width="18" height="10" rx="1.5" /><path d="M12 7v10M3 12h18M6 17v2M18 17v2" /></>,
  desk: <><path d="M3 8h18" /><path d="M4 8v12M20 8v12" /><rect x="13" y="8" width="7" height="7" /><path d="M15.5 11.5h2" /></>,
  lamp: <><path d="M8 3h8l3 8H5z" /><path d="M12 11v8M8 20h8" /></>,
  dots: <><circle cx="6" cy="12" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="18" cy="12" r="1.2" fill="currentColor" /></>,
};

export default function Icon({ name, size = 20, stroke = 1.5, className, title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
