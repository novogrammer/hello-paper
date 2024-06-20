export interface RGB{
  r:number;
  g:number;
  b:number;
}
export interface CMYK{
  c:number;
  m:number;
  y:number;
  k:number;
}

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 1 };
  }
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return { c, m, y, k };
}
export function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const r = (1 - c) * (1 - k);
  const g = (1 - m) * (1 - k);
  const b = (1 - y) * (1 - k);
  return { r, g, b };
}