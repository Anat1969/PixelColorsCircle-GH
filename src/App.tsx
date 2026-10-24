import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { EditProvider } from "@/state/EditContext";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";

const Index = lazy(() => import("./pages/Index.tsx"));
const ColorPsychology = lazy(() => import("./pages/ColorPsychology.tsx"));
const HowColorsWork = lazy(() => import("./pages/HowColorsWork.tsx"));

/** Shown for a moment while a page's code arrives. Never a blank screen. */
function Loading() {
  return (
    <div dir="rtl" className="newton-app grid min-h-screen place-items-center" role="status">
      <p className="label-mono">טוען את הכלי…</p>
    </div>
  );
}

/** New page starts at the top; in-page anchors still work. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <MotionConfig reducedMotion="user">
    <EditProvider>
      <Toaster />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/wheel" element={<Index />} />
          <Route path="/color-psychology" element={<ColorPsychology />} />
          <Route path="/how-colors-work" element={<HowColorsWork />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </EditProvider>
  </MotionConfig>
);

export default App;
