import { BASE_COLORS, SECTORS } from '@/data/newton';

/** The app icon: Newton's twelve-sector wheel. The only icon in the interface. */
export default function AppIcon({ size = 28, className }: { size?: number; className?: string }) {
  const r = 46;
  const inner = 18;
  const paths = BASE_COLORS.map((fill, i) => {
    const a0 = ((i * 360) / SECTORS - 90) * (Math.PI / 180);
    const a1 = (((i + 1) * 360) / SECTORS - 90) * (Math.PI / 180);
    const p = (rad: number, a: number) => `${50 + rad * Math.cos(a)} ${50 + rad * Math.sin(a)}`;
    return (
      <path key={fill} fill={fill}
        d={`M ${p(r, a0)} A ${r} ${r} 0 0 1 ${p(r, a1)} L ${p(inner, a1)} A ${inner} ${inner} 0 0 0 ${p(inner, a0)} Z`} />
    );
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect width="100" height="100" fill="#141414" />
      {paths}
      <circle cx="50" cy="50" r={inner - 4} fill="#ffffff" />
    </svg>
  );
}
