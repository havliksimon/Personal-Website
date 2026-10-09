import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { clampRect, type Bounds, type Rect } from './geometry';

interface MacWindowProps {
  title: string;
  rect: Rect;
  bounds: Bounds;
  z: number;
  dark?: boolean;
  /** Solid background — required for windows that embed an iframe (Safari bug with backdrop-filter). */
  solid?: boolean;
  closable?: boolean;
  headerExtra?: ReactNode;
  toolbar?: ReactNode;
  onFocus: () => void;
  onChange: (rect: Rect) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children: ReactNode;
}

export const MacWindow = ({
  title,
  rect,
  bounds,
  z,
  dark,
  solid,
  closable = true,
  headerExtra,
  toolbar,
  onFocus,
  onChange,
  onClose,
  onMinimize,
  onMaximize,
  children,
}: MacWindowProps) => {
  const drag = useRef<{ px: number; py: number; rect: Rect } | null>(null);
  const resize = useRef<{ px: number; py: number; rect: Rect } | null>(null);

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    onFocus();
    drag.current = { px: e.clientX, py: e.clientY, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moveDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    onChange(clampRect({ ...d.rect, x: d.rect.x + (e.clientX - d.px), y: d.rect.y + (e.clientY - d.py) }, bounds));
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const startResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    onFocus();
    e.stopPropagation();
    resize.current = { px: e.clientX, py: e.clientY, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moveResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = resize.current;
    if (!d) return;
    onChange(clampRect({ ...d.rect, w: d.rect.w + (e.clientX - d.px), h: d.rect.h + (e.clientY - d.py) }, bounds));
  };
  const endResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    resize.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`absolute flex flex-col overflow-hidden rounded-xl border shadow-[0_40px_90px_-25px_rgba(0,0,0,0.8)] ${
        dark
          ? 'border-white/10 bg-[#17171b]/95'
          : solid
            ? 'border-black/10 bg-white'
            : 'border-black/10 bg-white/90 backdrop-blur-xl'
      }`}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: z }}
      onPointerDown={onFocus}
    >
      <div
        className={`win-titlebar flex shrink-0 items-center gap-3 px-3 py-2 ${
          dark ? 'border-b border-white/10 bg-white/5' : 'border-b border-black/5 bg-white/70'
        }`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => onMaximize?.()}
      >
        <div className="group/tl flex items-center gap-2">
          <button
            type="button"
            aria-label="Close window"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className={`flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform duration-150 ease-out hover:scale-125 hover:brightness-110 active:scale-95 ${
              closable ? '' : 'opacity-40'
            }`}
          >
            <X className="h-2 w-2 text-black/50 opacity-0 transition-opacity duration-150 group-hover/tl:opacity-100" strokeWidth={3.5} />
          </button>
          <button
            type="button"
            aria-label="Minimize window"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform duration-150 ease-out hover:scale-125 hover:brightness-110 active:scale-95"
          >
            <Minus className="h-2 w-2 text-black/50 opacity-0 transition-opacity duration-150 group-hover/tl:opacity-100" strokeWidth={3.5} />
          </button>
          <button
            type="button"
            aria-label="Maximize window"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize?.();
            }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform duration-150 ease-out hover:scale-125 hover:brightness-110 active:scale-95"
          >
            <Plus className="h-2 w-2 text-black/50 opacity-0 transition-opacity duration-150 group-hover/tl:opacity-100" strokeWidth={3.5} />
          </button>
        </div>
        <span className={`mx-auto truncate text-[12px] font-medium ${dark ? 'text-zinc-300' : 'text-gray-500'}`}>
          {title}
        </span>
        <span className="flex w-16 items-center justify-end gap-1.5 text-[11px]">{headerExtra}</span>
      </div>

      {toolbar}

      <div className="relative flex-1 overflow-hidden">{children}</div>

      <div
        onPointerDown={startResize}
        onPointerMove={moveResize}
        onPointerUp={endResize}
        onPointerCancel={endResize}
        className="win-resize absolute bottom-0 right-0 z-20 h-4 w-4"
      />
    </div>
  );
};
