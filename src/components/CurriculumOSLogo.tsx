type CurriculumOSLogoProps = {
  variant?: 'icon' | 'horizontal';
  className?: string;
};

export default function CurriculumOSLogo({
  variant = 'horizontal',
  className = '',
}: CurriculumOSLogoProps) {
  if (variant === 'icon') {
    return null;
  }

  return (
    <span
      className={`text-[13px] font-semibold tracking-[-0.06em] text-slate-900 sm:text-[15px] ${className}`.trim()}
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      CurriculumOS
    </span>
  );
}
