import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { label?: string; valueText?: string };

/** Square slider: a recessed track and a raised square thumb. */
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, label, valueText, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="newton-well relative h-2.5 w-full grow overflow-hidden">
        <SliderPrimitive.Range className="absolute h-full" style={{ background: "linear-gradient(90deg, hsl(var(--g20)), hsl(var(--g44)))" }} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={valueText}
        className="block h-6 w-6 cursor-grab border border-white/30 bg-gradient-to-b from-[hsl(var(--g49))] to-[hsl(var(--g40))] shadow-[0_1px_0_rgba(255,255,255,.7)_inset,0_6px_14px_-4px_rgba(0,0,0,.9)] transition-transform hover:-translate-y-0.5 active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--newton-accent))] disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
