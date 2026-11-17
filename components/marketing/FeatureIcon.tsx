const icons = {
  file: (
    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 1.5V9h4.5" />
  ),
  card: <rect x="3" y="7" width="18" height="12" rx="2" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  resend: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5" />,
  support: (
    <>
      <path d="M5 16v-4a7 7 0 0 1 14 0v4" />
      <path d="M5 15h3v5H6a2 2 0 0 1-2-2v-3zm14 0h-3v5h2a2 2 0 0 0 2-2v-3z" />
    </>
  ),
} as const;

export function FeatureIcon({ name }: { name: keyof typeof icons }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-pine" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
