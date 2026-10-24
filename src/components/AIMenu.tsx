import { useEffect, useRef } from 'react';
import { useEdit, type SaveState } from '@/state/EditContext';

/** Development conversation for this app. */
export const DEV_SESSION_URL = 'https://claude.ai/code/session_017CCybXe4BBREfccjdcSjZM';

interface MenuItem {
  label: string;
  hint?: string;
  pressed?: boolean;
  disabled?: boolean;
  onSelect: () => unknown;
}

interface MenuElement extends HTMLElement {
  items: MenuItem[];
  status: string;
}

const STATUS: Record<SaveState, string> = { idle: 'מצב עריכה', saved: 'נשמר', error: 'שגיאה בשמירה' };

/**
 * The A&I logo button (https://appofapp-gh.vercel.app/ai-menu.js).
 * Every editing and development action lives inside it: copy link (with the current
 * state, which the wheel keeps in the address), development chat, install, edit mode.
 */
export default function AIMenu() {
  const ref = useRef<MenuElement>(null);
  const { editing, setEditing, overrides, resetAll, saveState } = useEdit();
  const editCount = Object.keys(overrides).length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.items = [
      {
        label: editing ? 'סיום עריכה' : 'מצב עריכה',
        hint: editing ? 'פעיל' : 'עריכת טקסטים ותמונות',
        pressed: editing,
        onSelect: () => setEditing(!editing),
      },
      {
        label: 'שחזור הטקסטים המקוריים',
        hint: editCount ? `${editCount} שינויים` : 'אין שינויים',
        disabled: editCount === 0,
        onSelect: () => {
          if (window.confirm('לשחזר את כל הטקסטים שנערכו לנוסח המקורי?')) resetAll();
        },
      },
    ];
    el.status = editing ? STATUS[saveState] : saveState === 'error' ? STATUS.error : '';
  }, [editing, setEditing, editCount, resetAll, saveState]);

  return <ai-menu ref={ref} chat={DEV_SESSION_URL} />;
}
