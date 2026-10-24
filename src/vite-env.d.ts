/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "ai-menu": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { chat?: string; research?: string };
  }
}
