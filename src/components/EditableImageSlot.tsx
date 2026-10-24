import React, { useCallback, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useEdit } from "@/state/EditContext";

interface EditableImageSlotProps {
  storageKey: string;
  fallbackGradient: string;
  placeholderText?: string;
  className?: string;
}

const STORAGE_PREFIX = "editable-image-slot-";
const MAX_SIDE = 1200;

/** Downscale large photos before storing, so localStorage does not fill up. */
async function fileToDataURL(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Illustration slot. Visitors see the image (or a colour field).
 * In edit mode (A&I menu) it accepts upload, drag and drop, paste, replace and remove.
 */
const EditableImageSlot: React.FC<EditableImageSlotProps> = ({
  storageKey,
  fallbackGradient,
  placeholderText = "תמונה להמחשה",
  className = "",
}) => {
  const { editing } = useEdit();
  const fullKey = STORAGE_PREFIX + storageKey;
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(fullKey);
      if (saved) setImageURL(saved);
    } catch {
      /* storage unavailable */
    }
  }, [fullKey]);

  const saveImage = useCallback((dataURL: string) => {
    setImageURL(dataURL);
    try {
      localStorage.setItem(fullKey, dataURL);
      toast.success("התמונה נשמרה");
    } catch {
      toast.error("התמונה מוצגת, אבל לא נשמרה: האחסון בדפדפן מלא. נסו תמונה קטנה יותר.");
    }
  }, [fullKey]);

  const removeImage = useCallback(() => {
    setImageURL(null);
    try {
      localStorage.removeItem(fullKey);
    } catch {
      /* storage unavailable */
    }
  }, [fullKey]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("זה לא קובץ תמונה. בחרו JPG, PNG או WEBP.");
      return;
    }
    try {
      saveImage(await fileToDataURL(file));
    } catch {
      toast.error("לא הצלחנו לקרוא את התמונה. נסו קובץ אחר.");
    }
  }, [saveImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !editing) return;
    const onPaste = (e: ClipboardEvent) => {
      for (const item of Array.from(e.clipboardData?.items ?? [])) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
          }
          break;
        }
      }
    };
    container.addEventListener("paste", onPaste);
    return () => container.removeEventListener("paste", onPaste);
  }, [handleFile, editing]);

  const drag = editing
    ? {
        onDragOver: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); },
        onDragLeave: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        },
      }
    : {};

  return (
    <div
      ref={containerRef}
      tabIndex={editing ? 0 : -1}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: imageURL ? undefined : fallbackGradient,
        border: isDragging ? "2px dashed rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
        minHeight: "7rem",
      }}
      {...drag}
    >
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" tabIndex={-1}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

      {imageURL && <img src={imageURL} alt={placeholderText} className="h-full w-full object-cover" />}

      {editing && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 ${imageURL ? "bg-black/55" : ""}`}>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button type="button" className="btn btn-sm" onClick={() => fileInputRef.current?.click()}>
              {imageURL ? "החלפת תמונה" : "העלאת תמונה"}
            </button>
            {imageURL && <button type="button" className="btn btn-sm is-danger" onClick={removeImage}>הסרה</button>}
          </div>
          <span className="text-center text-[11px] text-newton-text/80">{isDragging ? "שחררו כאן" : "או גררו, או הדביקו כשהמסגרת בפוקוס"}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(EditableImageSlot);
