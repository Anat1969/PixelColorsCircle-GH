import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/** Square, dark toasts that match the Optical Graphite panels. */
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    dir="rtl"
    position="bottom-center"
    className="toaster group"
    toastOptions={{
      style: { borderRadius: 0, fontFamily: "var(--font-sans)" },
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-[hsl(var(--newton-panel-2))] group-[.toaster]:text-foreground group-[.toaster]:border-white/15 group-[.toaster]:shadow-[0_24px_50px_-20px_rgba(0,0,0,.9)]",
        description: "group-[.toast]:text-muted-foreground",
      },
    }}
    {...props}
  />
);

export { Toaster, toast };
