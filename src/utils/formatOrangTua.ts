export function formatOrangTua(
  bapak: string,
  ibu: string,
  almBapak: boolean,
  almIbu: boolean,
  anakKe: string,
  isPria: boolean
): string {
  if (!bapak && !ibu) return "";
  const anakKeStr = anakKe ? `, anak ke-${anakKe}` : "";
  const almBapakStr = almBapak ? "Alm. " : "";
  const almIbuStr = almIbu ? "Almh. " : "";
  const ortuStr = isPria
    ? `Putra dari ${almBapakStr}${bapak} & ${almIbuStr}${ibu}${anakKeStr}`
    : `Putri dari ${almBapakStr}${bapak} & ${almIbuStr}${ibu}${anakKeStr}`;
  return ortuStr;
} 