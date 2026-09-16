import {
  DailyRecord,
  DailyStudentPrayer,
  DhuhaStatus,
  FardhuPrayerKey,
  KelancaranLevel,
  PrayerStatus,
  StarLevel,
  Student,
  StudentStats,
} from '../types';

export const PRAYER_NAMES: Record<FardhuPrayerKey, string> = {
  subuh: 'Subuh',
  dzuhur: 'Zuhur',
  ashar: 'Asar',
  maghrib: 'Magrib',
  isya: 'Isya',
};

export const PRAYER_STATUS_CONFIG: Record<
  PrayerStatus,
  { label: string; shortLabel: string; bg: string; text: string; border: string }
> = {
  berjamaah: {
    label: 'Berjamaah (✓)',
    shortLabel: 'Jamaah',
    bg: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  munfarid: {
    label: 'Sendiri (✓)',
    shortLabel: 'Sendiri',
    bg: 'bg-sky-50 text-sky-800 hover:bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-300',
  },
  terlambat: {
    label: 'Terlambat / Qadha',
    shortLabel: 'Terlambat',
    bg: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
  },
  tidak: {
    label: 'Belum / Tidak Sholat',
    shortLabel: 'Tidak',
    bg: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  udzur: {
    label: 'Udzur Syar\'i',
    shortLabel: 'Udzur',
    bg: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
  },
};

export const DHUHA_STATUS_CONFIG: Record<
  DhuhaStatus,
  { label: string; shortLabel: string; bg: string; text: string; points: number }
> = {
  berjamaah_sekolah: {
    label: 'Di Sekolah (Jamaah)',
    shortLabel: 'Di Sekolah',
    bg: 'bg-teal-50 text-teal-800 border-teal-300',
    text: 'text-teal-700',
    points: 2,
  },
  '8_rakaat': {
    label: '8 Rakaat',
    shortLabel: '8 Rakaat',
    bg: 'bg-amber-100 text-amber-900 border-amber-300',
    text: 'text-amber-800',
    points: 2,
  },
  '4_rakaat': {
    label: '4 Rakaat',
    shortLabel: '4 Rakaat',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    text: 'text-emerald-700',
    points: 2,
  },
  '2_rakaat': {
    label: '2 Rakaat',
    shortLabel: '2 Rakaat',
    bg: 'bg-sky-50 text-sky-800 border-sky-300',
    text: 'text-sky-700',
    points: 2,
  },
  tidak: {
    label: 'Belum / Tidak Sholat',
    shortLabel: 'Belum',
    bg: 'bg-slate-100 text-slate-500 border-slate-200',
    text: 'text-slate-500',
    points: 0,
  },
};

export const KELANCARAN_CONFIG: Record<
  KelancaranLevel,
  { label: string; badge: string; desc: string; stars: string }
> = {
  lancar: {
    label: 'Lancar',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Lancar, tajwid dan makhraj fasih',
    stars: '⭐⭐⭐',
  },
  mumtaz: {
    label: 'Sangat Lancar (Mumtaz)',
    badge: 'bg-teal-100 text-teal-800 border-teal-300',
    desc: 'Sangat lancar dan tartil',
    stars: '⭐⭐⭐',
  },
  cukup: {
    label: 'Cukup Lancar',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Cukup lancar, perlu bimbingan waqaf & mad',
    stars: '⭐⭐',
  },
  perlu_bimbingan: {
    label: 'Perlu Bimbingan / Ulang',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    desc: 'Perlu diulang kembali bersama orang tua / guru',
    stars: '⭐',
  },
};

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function getDefaultPrayerRecord(): DailyStudentPrayer {
  return {
    subuh: 'tidak',
    dzuhur: 'tidak',
    ashar: 'tidak',
    maghrib: 'tidak',
    isya: 'tidak',
    dhuha: 'tidak',
  };
}

/**
 * Rules as requested:
 * - Salat fardu lengkap = 5 poin (1 poin per waktu)
 * - Dhuha = 2 poin
 * - Mengaji = 3 poin
 */
export function calculateDailyPoints(
  prayers: DailyStudentPrayer,
  hasMengaji: boolean
): {
  fardhuPoints: number;
  dhuhaPoints: number;
  mengajiPoints: number;
  totalPoints: number;
  fardhuDoneCount: number;
  isDhuhaDone: boolean;
} {
  const fardhuKeys: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  let fardhuDoneCount = 0;

  fardhuKeys.forEach((key) => {
    const st = prayers[key];
    if (st === 'berjamaah' || st === 'munfarid' || st === 'udzur') {
      fardhuDoneCount++;
    }
  });

  // 1 poin per sholat fardu terlaksana, lengkap = 5 poin
  const fardhuPoints = fardhuDoneCount;
  const isDhuhaDone = prayers.dhuha !== 'tidak';
  const dhuhaPoints = isDhuhaDone ? 2 : 0;
  const mengajiPoints = hasMengaji ? 3 : 0;

  return {
    fardhuPoints,
    dhuhaPoints,
    mengajiPoints,
    totalPoints: fardhuPoints + dhuhaPoints + mengajiPoints,
    fardhuDoneCount,
    isDhuhaDone,
  };
}

/**
 * Determine star reward:
 * ⭐ Bintang Perunggu (50 poin)
 * ⭐⭐ Bintang Perak (100 poin)
 * ⭐⭐⭐ Bintang Emas (150 poin)
 */
export function getStarBadge(points: number): {
  level: StarLevel;
  starCount: number;
  name: string;
  badgeClass: string;
  nextThreshold: number;
  nextLabel: string;
  progressPct: number;
} {
  if (points >= 150) {
    return {
      level: 'emas',
      starCount: 3,
      name: 'Bintang Emas ⭐⭐⭐',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
      nextThreshold: 150,
      nextLabel: 'Tingkat Maksimal!',
      progressPct: 100,
    };
  } else if (points >= 100) {
    return {
      level: 'perak',
      starCount: 2,
      name: 'Bintang Perak ⭐⭐',
      badgeClass: 'bg-slate-200 text-slate-800 border-slate-400',
      nextThreshold: 150,
      nextLabel: `${150 - points} poin lagi ke Bintang Emas`,
      progressPct: Math.round(((points - 100) / 50) * 100),
    };
  } else if (points >= 50) {
    return {
      level: 'perunggu',
      starCount: 1,
      name: 'Bintang Perunggu ⭐',
      badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
      nextThreshold: 100,
      nextLabel: `${100 - points} poin lagi ke Bintang Perak`,
      progressPct: Math.round(((points - 50) / 50) * 100),
    };
  } else {
    return {
      level: 'none',
      starCount: 0,
      name: 'Calon Bintang',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
      nextThreshold: 50,
      nextLabel: `${50 - points} poin lagi ke Bintang Perunggu`,
      progressPct: Math.round((points / 50) * 100),
    };
  }
}

/**
 * Calculate weekly and all-time stats for a student across records
 */
export function calculateStudentStats(
  studentId: string,
  records: Record<string, DailyRecord>,
  todayDateStr: string
): StudentStats {
  let totalPoints = 0;
  let fardhuCompletedTotal = 0;
  let dhuhaCount = 0;
  let mengajiCount = 0;
  let verifiedByParentsCount = 0;

  // Build the last 7 days list (weekly window)
  const today = new Date(todayDateStr);
  const weekDates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    weekDates.push(`${yyyy}-${mm}-${dd}`);
  }

  let weeklyFardhuDone = 0;
  let weeklyDhuhaDone = 0;
  let weeklyMengajiDone = 0;

  // Iterate all records for this student
  Object.values(records).forEach((rec) => {
    if (rec.studentId !== studentId) return;

    const hasMengaji = Boolean(rec.mengaji && rec.mengaji.jilidOrSurah);
    const pts = calculateDailyPoints(rec.prayers, hasMengaji);

    totalPoints += pts.totalPoints;
    fardhuCompletedTotal += pts.fardhuDoneCount;
    if (pts.isDhuhaDone) dhuhaCount++;
    if (hasMengaji) mengajiCount++;
    if (rec.verifikasiOrtu) verifiedByParentsCount++;

    if (weekDates.includes(rec.date)) {
      weeklyFardhuDone += pts.fardhuDoneCount;
      if (pts.isDhuhaDone) weeklyDhuhaDone++;
      if (hasMengaji) weeklyMengajiDone++;
    }
  });

  const starInfo = getStarBadge(totalPoints);

  // Weekly attendance percent (35 fardhu + 7 dhuha + 7 mengaji = 49 total items)
  const totalPossible = 7 * 5 + 7 + 7; // 49
  const totalDone = weeklyFardhuDone + weeklyDhuhaDone + weeklyMengajiDone;
  const kehadiranPersen = Math.min(100, Math.round((totalDone / totalPossible) * 100));

  return {
    totalPoints,
    starLevel: starInfo.level,
    starCount: starInfo.starCount,
    fardhuCompletedTotal,
    dhuhaCount,
    mengajiCount,
    weeklyFardhu: { done: weeklyFardhuDone, total: 35 },
    weeklyDhuha: { done: weeklyDhuhaDone, total: 7 },
    weeklyMengaji: { done: weeklyMengajiDone, total: 7 },
    kehadiranPersen,
    verifiedByParentsCount,
  };
}

export function generateWhatsAppReport(
  student: Student,
  dateStr: string,
  record?: DailyRecord,
  stats?: StudentStats
): string {
  const formattedDate = formatIndonesianDate(dateStr);
  const prayers = record?.prayers || getDefaultPrayerRecord();
  const mengaji = record?.mengaji;
  const isVerified = record?.verifikasiOrtu;

  const fardhuKeys: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const fardhuLines = fardhuKeys
    .map((k) => {
      const status = prayers[k];
      const icon =
        status === 'berjamaah'
          ? '✅ (Berjamaah)'
          : status === 'munfarid'
          ? '🔹 (Sendiri)'
          : status === 'terlambat'
          ? '⚠️ (Terlambat)'
          : status === 'udzur'
          ? '🌸 (Udzur Syar\'i)'
          : '❌ (Belum/Tidak)';
      return `• Sholat ${PRAYER_NAMES[k]}: ${icon}`;
    })
    .join('\n');

  const dhuhaStatusText =
    prayers.dhuha === 'berjamaah_sekolah'
      ? '✅ Ya (Berjamaah di Mushola SD Negeri Jombor)'
      : prayers.dhuha === '8_rakaat'
      ? '✅ Ya (8 Rakaat)'
      : prayers.dhuha === '4_rakaat'
      ? '✅ Ya (4 Rakaat)'
      : prayers.dhuha === '2_rakaat'
      ? '✅ Ya (2 Rakaat)'
      : '❌ Belum/Tidak';

  let mengajiText = '• Belum setor mengaji';
  if (mengaji && mengaji.jilidOrSurah) {
    const kelancaranLabel = KELANCARAN_CONFIG[mengaji.kelancaran]?.label || '-';
    mengajiText = `• Bacaan/Kitab: ${mengaji.jilidOrSurah} (${mengaji.halamanOrAyat || '-'})\n• Kelancaran: ${kelancaranLabel}${
      mengaji.catatan ? `\n• Catatan: "${mengaji.catatan}"` : ''
    }`;
  }

  const starInfo = stats ? getStarBadge(stats.totalPoints) : null;
  const starLine = starInfo
    ? `\n⭐ *Bintang Kebaikan:* ${starInfo.name} (${stats?.totalPoints} Poin)`
    : '';

  const weeklyLine = stats
    ? `\n📊 *Rekap Mingguan:*
• Salat Fardu: ${stats.weeklyFardhu.done}/${stats.weeklyFardhu.total}
• Dhuha: ${stats.weeklyDhuha.done}/${stats.weeklyDhuha.total}
• Mengaji: ${stats.weeklyMengaji.done}/${stats.weeklyMengaji.total}
• Kehadiran Ibadah: ${stats.kehadiranPersen}%`
    : '';

  const teacherNote = record?.catatanGuru
    ? `\n\n📝 *Pesan & Motivasi Guru:*\n"${record.catatanGuru}"`
    : '';

  const parentVerificationNote = isVerified
    ? `\n\n✅ *Status Verifikasi Orang Tua:* SUDAH DIVERIFIKASI (${record?.namaOrtu || 'Orang Tua'})`
    : `\n\n⏳ *Status Verifikasi Orang Tua:* Menunggu Verifikasi`;

  return `*BUKU MUTABA'AH IBADAH SISWA*
*SD NEGERI JOMBOR*
──────────────────────
👤 *Nama Siswa:* ${student.nama} (No. Absen: ${student.absen})
🏫 *Kelas:* ${student.kelas} | *NIS:* ${student.nis}
📅 *Hari/Tanggal:* ${formattedDate}
${starLine}

🕌 *SALAT FARDU 5 WAKTU:*
${fardhuLines}

☀️ *SALAT DHUHA:*
• Salat Dhuha: ${dhuhaStatusText}

📖 *KEGIATAN MENGAJI (IQRO / AL-QUR'AN):*
${mengajiText}${weeklyLine}${teacherNote}${parentVerificationNote}

_Mohon pendampingan dan bimbingan Ayah/Bunda di rumah agar ananda senantiasa istiqomah dalam mendirikan salat dan membaca Al-Qur'an._

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
*Guru Kelas:* Zumrotun Nafisah, S.Pd.I`;
}
