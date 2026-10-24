import { createElement, type KeyboardEvent } from 'react';
import { useEdit } from '@/state/EditContext';

interface Props {
  id: string;
  children: string;
  as?: 'p' | 'span' | 'h2' | 'h3' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Text that can be rewritten in place while edit mode is on (A&I menu).
 * Saves on blur; an empty edit restores the original text.
 */
export default function EditableText({ id, children, as = 'span', className, style }: Props) {
  const { editing, text, setText } = useEdit();
  const value = text(id, children);

  if (!editing) return createElement(as, { className, style }, value);

  return createElement(as, {
    key: `${id}:${value}`,
    className,
    style,
    contentEditable: 'plaintext-only',
    suppressContentEditableWarning: true,
    'data-editable': 'true',
    role: 'textbox',
    'aria-label': `עריכת טקסט: ${children.slice(0, 40)}`,
    onBlur: (e: React.FocusEvent<HTMLElement>) => setText(id, e.currentTarget.textContent ?? '', children),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (e.key === 'Escape') {
        e.currentTarget.textContent = value;
        e.currentTarget.blur();
      }
    },
    children: value,
  });
}
