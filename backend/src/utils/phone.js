const normalizePhone = (input) => {
  if (input === undefined || input === null) return null;

  const raw = String(input).trim();
  if (!raw) return null;

  const hasPlus = raw.startsWith('+');
  const digits = hasPlus ? raw.slice(1) : raw;

  if (!/^\d+$/.test(digits)) {
    return { error: 'Nomor telepon hanya boleh berisi angka (opsional diawali +62).' };
  }

  if (digits.length < 10 || digits.length > 15) {
    return { error: 'Nomor telepon harus 10–15 digit.' };
  }

  if (!(digits.startsWith('0') || digits.startsWith('62'))) {
    return { error: 'Nomor telepon harus diawali 0 atau 62.' };
  }

  if (/^0+$/.test(digits)) {
    return { error: 'Nomor telepon tidak valid.' };
  }

  return { value: digits };
};

module.exports = { normalizePhone };
