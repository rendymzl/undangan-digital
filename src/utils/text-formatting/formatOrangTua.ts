import { toTitleCase } from "./toTitleCase";

export const formatOrangTua = (
  bapak: string | null,
  ibu: string | null,
  almBapak: boolean,
  almIbu: boolean,
  anakKe: string | null,
  isPria: boolean
): string | null => {
  if (!bapak && !ibu) return null;

  const bapakTrim = toTitleCase(bapak?.trim() ?? '');
  const ibuTrim = toTitleCase(ibu?.trim() ?? '');
  const anakKeTrim = anakKe?.trim();

  const bapakPrefix = almBapak ? "Alm. Bapak" : "Bapak";
  const ibuPrefix = almIbu ? "Almh. Ibu" : "Ibu";
  const genderPrefix = isPria ? "Putra" : "Putri";

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

  // --- PERBAIKAN LOGIKA DI SINI ---
  if (anakKeTrim) {
    // Cek apakah input adalah angka yang valid
    const isNumeric = !isNaN(parseInt(anakKeTrim, 10)) && isFinite(Number(anakKeTrim));

    // Jika angka, gunakan format "Putra ke-2".
    // Jika teks (cth: "Bungsu"), gunakan format "Putra Bungsu".
    const anakDetail = isNumeric ? `ke-${anakKeTrim}` : anakKeTrim;

    return `${genderPrefix} ${anakDetail} dari ${orangTuaText}`;
  }

  return `${genderPrefix} dari ${orangTuaText}`;
};