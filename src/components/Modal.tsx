import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, children, close, wide = false }: { title: string; children: ReactNode; close: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeRef = useRef(close); closeRef.current = close;
  useEffect(() => {
    const dialog = ref.current!;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const cancel = (event: Event) => { event.preventDefault(); closeRef.current(); };
    dialog.addEventListener('cancel', cancel);
    return () => { dialog.removeEventListener('cancel', cancel); dialog.close(); previouslyFocused?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'modal-wide' : ''}`} aria-labelledby={titleId} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="modal-inner">
      <div className="modal-heading"><h2 id={titleId}>{title}</h2><button className="icon-button" onClick={close} aria-label="Close dialog" title="Close (Escape)"><X size={19} /></button></div>
      {children}
    </div>
  </dialog>;
}
