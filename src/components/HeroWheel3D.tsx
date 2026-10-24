import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { RINGS, SECTORS, BASE_COLORS } from '@/data/newton';
import { ringColor, ringSectorPath } from '@/hooks/useColorWheel';

const C = 200;
const R_IN = 34;
const R_OUT = 190;
const T = (R_OUT - R_IN) / RINGS;

function RingLayer({ ring }: { ring: number }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {BASE_COLORS.map((base, s) => (
        <path key={s} fill={ringColor(base, ring)} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"
          d={ringSectorPath(C, C, R_IN + ring * T, R_IN + (ring + 1) * T, s * (360 / SECTORS), (s + 1) * (360 / SECTORS))} />
      ))}
    </svg>
  );
}

/**
 * Newton's wheel as four floating layers in perspective: the rings separate in depth,
 * saturated on top, pale at the base. Hover opens the layers further.
 * With reduced motion it stands still; without 3D support it is a flat, readable wheel.
 */
export default function HeroWheel3D() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const gap = open ? 46 : 26;

  return (
    <div className="relative mx-auto aspect-square w-[88%] max-w-[460px] sm:w-full" style={{ perspective: '1100px' }}
      onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)}
      role="img" aria-label="גלגל הצבעים של ניוטון בתלת־ממד: ארבע טבעות בהירות במדרגות, הרוויה למעלה והבהירה בבסיס">
      <div className="absolute inset-[12%] translate-y-[18%] bg-black/70 blur-3xl" aria-hidden="true" />
      <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: 58, rotateZ: 0 }}
        animate={reduce ? { rotateX: 58, rotateZ: -20 } : { rotateX: 58, rotateZ: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 60, ease: 'linear', repeat: Infinity }}>
        {Array.from({ length: RINGS }, (_, i) => RINGS - 1 - i).map(ring => (
          <motion.div key={ring} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}
            initial={reduce ? false : { z: 0, opacity: 0 }}
            animate={{ z: (RINGS - 1 - ring) * -gap + gap * 1.5, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 70, damping: 16, delay: reduce ? 0 : 0.15 * ring }}>
            <RingLayer ring={ring} />
          </motion.div>
        ))}
        <div className="absolute left-1/2 top-1/2 h-[15%] w-[15%] rounded-full bg-[#f1efe9] shadow-[0_0_40px_rgba(255,255,255,.25)]"
          style={{ transform: `translate(-50%, -50%) translateZ(${gap * -1.5}px)` }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
