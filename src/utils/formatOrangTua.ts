export const formatOrangTua = (
  bapak: string | null,
  ibu: string | null,
  almBapak: boolean,
  almIbu: boolean,
  anakKe: string | null,
  isPria: boolean
): string | null => {
  if (!bapak && !ibu) return null;
  const bapakTrim = bapak?.trim();
  const ibuTrim = ibu?.trim();
  const anakKeTrim = anakKe?.trim();
  const bapakPrefix = almBapak ? "Alm. Bapak" : "Bapak";
  const ibuPrefix = almIbu ? "Almh. Ibu" : "Ibu";
  const anakPrefix = isPria ? "Putra" : "Putri";

  let orangTuaText = "";
  if (bapakTrim && ibuTrim) {
    orangTuaText = `${bapakPrefix} ${bapakTrim} & ${ibuPrefix} ${ibuTrim}`;
  } else if (bapakTrim) {
    orangTuaText = `${bapakPrefix} ${bapakTrim}`;
  } else if (ibuTrim) {
    orangTuaText = `${ibuPrefix} ${ibuTrim}`;
  } else {
    return null;
  }

  if (anakKeTrim) {
    return `${anakPrefix} ke-${anakKeTrim} dari ${orangTuaText}`;
  }
  return `${anakPrefix} dari ${orangTuaText}`;
};