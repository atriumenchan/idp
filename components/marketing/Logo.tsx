export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-xl bg-navy font-serif text-lg leading-none text-ivory ${className}`}
      aria-hidden="true"
    >
      H
    </span>
  );
}
