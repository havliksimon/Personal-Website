export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Bounds {
  w: number;
  h: number;
}

const MENU_H = 30;
const DOCK_H = 104;

export const clampRect = (rect: Rect, bounds: Bounds): Rect => {
  const w = Math.min(Math.max(rect.w, 300), Math.max(320, bounds.w - 24));
  const h = Math.min(Math.max(rect.h, 200), Math.max(240, bounds.h - MENU_H - DOCK_H));
  const x = Math.min(Math.max(rect.x, 8), Math.max(8, bounds.w - w - 8));
  const y = Math.min(Math.max(rect.y, MENU_H + 4), Math.max(MENU_H + 4, bounds.h - h - DOCK_H));
  return { x, y, w, h };
};

export const place = (bounds: Bounds, w: number, h: number, dx = 0, dy = 0): Rect =>
  clampRect({ x: (bounds.w - w) / 2 + dx, y: (bounds.h - h) / 2 + dy, w, h }, bounds);
