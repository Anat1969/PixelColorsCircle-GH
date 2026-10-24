import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  CENTER, RINGS, SECTORS, OUTER_RADIUS, INNER_GAP, RING_THICKNESS,
  ROTATION_STEP_DEG, ringSectorPath, ringColor, sectorToBaseColor,
  polarToCartesian, sectorToNewtonName,
} from '@/hooks/useColorWheel';
import { RING_LABELS } from '@/data/newton';

interface ColorWheelProps {
  rotationOffset: number;
  isOpened: (ring: number, sector: number) => boolean;
  canSelectByMode: (ring: number, sector: number) => boolean;
  onCellClick: (ring: number, sector: number) => void;
  selectionLimit: number;
  openedCount: number;
  maskOpacity: number;
}

const cellPath = (ring: number, sector: number) => {
  const start = sector * ROTATION_STEP_DEG;
  const innerR = INNER_GAP + ring * RING_THICKNESS;
  return ringSectorPath(CENTER, CENTER, innerR, innerR + RING_THICKNESS, start, start + ROTATION_STEP_DEG);
};

/**
 * Newton's wheel in SVG: a fixed colour layer, a rotating black mask, a grid and labels.
 * Mask rule (final): the mask covers everything at the slider's opacity; a click makes
 * only that cell fully transparent; nothing else on the mask changes.
 * Keyboard: right/left arrows go clockwise/counter-clockwise, up/down move between rings, Enter or Space opens.
 */
const ColorWheel: React.FC<ColorWheelProps> = ({
  rotationOffset, isOpened, canSelectByMode, onCellClick, selectionLimit, openedCount, maskOpacity,
}) => {
  const maskAlpha = maskOpacity / 100;
  const [focus, setFocus] = useState({ ring: RINGS - 1, sector: 0 });
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState<{ ring: number; sector: number } | null>(null);
  const refs = useRef<Record<string, SVGPathElement | null>>({});

  const baseCells = useMemo(() => {
    const cells: { key: string; d: string; fill: string }[] = [];
    for (let ring = 0; ring < RINGS; ring++) {
      for (let sector = 0; sector < SECTORS; sector++) {
        cells.push({ key: `base-${ring}-${sector}`, d: cellPath(ring, sector), fill: ringColor(sectorToBaseColor(sector), ring) });
      }
    }
    return cells;
  }, []);

  const gridElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let i = 1; i <= RINGS; i++) {
      elements.push(
        <circle key={`gc-${i}`} cx={CENTER} cy={CENTER} r={INNER_GAP + i * RING_THICKNESS}
          fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="3" />
      );
    }
    for (let s = 0; s < SECTORS; s++) {
      const angle = s * ROTATION_STEP_DEG;
      const p1 = polarToCartesian(CENTER, CENTER, INNER_GAP - 8, angle);
      const p2 = polarToCartesian(CENTER, CENTER, OUTER_RADIUS, angle);
      elements.push(
        <line key={`gl-${s}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.78)" strokeWidth="3" />
      );
    }
    return elements;
  }, []);

  const overlayCells = useMemo(() => {
    const cells: { key: string; d: string; ring: number; sector: number }[] = [];
    for (let ring = 0; ring < RINGS; ring++) {
      for (let sector = 0; sector < SECTORS; sector++) {
        cells.push({ key: `${ring}-${sector}`, d: cellPath(ring, sector), ring, sector });
      }
    }
    return cells;
  }, []);

  const colorLabels = useMemo(() => {
    const labels: React.ReactNode[] = [];
    for (let s = 0; s < SECTORS; s++) {
      const angle = (s + 0.5) * ROTATION_STEP_DEG;
      const pos = polarToCartesian(CENTER, CENTER, OUTER_RADIUS + 26, angle);
      labels.push(
        <text key={`label-${s}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
          fill="rgba(240,238,233,0.72)" fontSize="21" fontFamily="var(--font-sans)"
          className="pointer-events-none select-none">
          {sectorToNewtonName(s)}
        </text>
      );
    }
    return labels;
  }, []);

  /** The hue a mask cell currently reveals, after rotation. */
  const visibleName = (sector: number) => sectorToNewtonName((sector + rotationOffset) % SECTORS);

  const moveFocus = useCallback((ring: number, sector: number) => {
    const next = { ring: Math.max(0, Math.min(RINGS - 1, ring)), sector: ((sector % SECTORS) + SECTORS) % SECTORS };
    setFocus(next);
    refs.current[`${next.ring}-${next.sector}`]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent, ring: number, sector: number, canInteract: boolean) => {
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); moveFocus(ring, sector + 1); break;
      case 'ArrowLeft': e.preventDefault(); moveFocus(ring, sector - 1); break;
      case 'ArrowUp': e.preventDefault(); moveFocus(ring + 1, sector); break;
      case 'ArrowDown': e.preventDefault(); moveFocus(ring - 1, sector); break;
      case 'Home': e.preventDefault(); moveFocus(ring, 0); break;
      case 'End': e.preventDefault(); moveFocus(ring, SECTORS - 1); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (canInteract) onCellClick(ring, sector);
        break;
    }
  };

  const highlight = (focused ? focus : null) ?? hover;

  return (
    <div className="newton-well relative grid place-items-center overflow-hidden px-2 py-4 md:py-8">
      <svg viewBox="-20 -20 940 940" role="group"
        aria-label="גלגל הצבעים של ניוטון: 4 טבעות ו־12 פלחים. חצים לתנועה, Enter לפתיחה."
        className="block h-auto w-full max-w-[820px]">
        <defs>
          <filter id="wheel-depth" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        <g filter="url(#wheel-depth)">
          {baseCells.map(cell => (
            <path key={cell.key} d={cell.d} fill={cell.fill} stroke="rgba(255,255,255,0.32)" strokeWidth="1.6" />
          ))}
        </g>

        {/* Mask layer: rotates as a whole */}
        <g style={{
          transformOrigin: `${CENTER}px ${CENTER}px`,
          transform: `rotate(${rotationOffset * ROTATION_STEP_DEG}deg)`,
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {overlayCells.map(cell => {
            const open = isOpened(cell.ring, cell.sector);
            const selectable = canSelectByMode(cell.ring, cell.sector);
            const canInteract = open || (openedCount < selectionLimit && selectable);
            const isFocusTarget = focus.ring === cell.ring && focus.sector === cell.sector;
            const label = `${visibleName(cell.sector)}, טבעת ${cell.ring + 1} (${RING_LABELS[cell.ring]})`;

            return (
              <path
                key={cell.key}
                ref={el => { refs.current[cell.key] = el; }}
                d={cell.d}
                data-cell={cell.key}
                role="button"
                tabIndex={isFocusTarget ? 0 : -1}
                aria-pressed={open}
                aria-disabled={!canInteract}
                aria-label={`${label}${open ? ', פתוח' : canInteract ? '' : ', לא זמין במצב הנוכחי'}`}
                className={`outline-none transition-opacity duration-150 ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                fill={open ? 'transparent' : `hsl(var(--newton-mask) / ${maskAlpha})`}
                onClick={canInteract ? () => { setFocus({ ring: cell.ring, sector: cell.sector }); onCellClick(cell.ring, cell.sector); } : undefined}
                onKeyDown={e => onKeyDown(e, cell.ring, cell.sector, canInteract)}
                onFocus={() => { setFocus({ ring: cell.ring, sector: cell.sector }); setFocused(true); }}
                onBlur={() => setFocused(false)}
                onPointerEnter={() => setHover({ ring: cell.ring, sector: cell.sector })}
                onPointerLeave={() => setHover(null)}
              >
                <title>{label}</title>
              </path>
            );
          })}
        </g>

        <g className="pointer-events-none">{gridElements}</g>

        {/* Hover / keyboard focus outline: drawn above the grid, never changes the mask */}
        {highlight && (
          <g className="pointer-events-none" style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transform: `rotate(${rotationOffset * ROTATION_STEP_DEG}deg)`,
          }}>
            <path d={cellPath(highlight.ring, highlight.sector)} fill="none"
              stroke={focused ? 'hsl(41 62% 74%)' : 'rgba(255,255,255,0.95)'} strokeWidth={focused ? 6 : 4} />
          </g>
        )}

        <circle cx={CENTER} cy={CENTER} r={INNER_GAP - 10} fill="#f1efe9" stroke="rgba(255,255,255,0.6)" strokeWidth="2"
          className="pointer-events-none" />

        {colorLabels}
      </svg>
    </div>
  );
};

export default React.memo(ColorWheel);
