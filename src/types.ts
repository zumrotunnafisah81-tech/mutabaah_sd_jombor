export type FardhuPrayerKey = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export type PrayerStatus = 'berjamaah' | 'munfarid' | 'terlambat' | 'tidak' | 'udzur';

export type DhuhaStatus = 'tidak' | '2_rakaat' | '4_rakaat' | '8_rakaat' | 'berjamaah_sekolah';

export type MengajiType = 'iqro' | 'quran' | 'juz_amma' | 'yanbua' | 'ummi';

export type KelancaranLevel = 'lancar' | 'cukup' | 'perlu_bimbingan' | 'mumtaz';

export interface MengajiEntry {
  type: MengajiType;
  jilidOrSurah: string; // contoh: "Iqro Jilid 3" atau "QS. Al-Mulk"
  halamanOrAyat: string; // contoh: "Hal 1–3" atau "Ayat 1-15"
  kelancaran: KelancaranLevel;
  catatan?: string;
  waktu?: string;
}

export interface DailyStudentPrayer {
  subuh: PrayerStatus;
  dzuhur: PrayerStatus;
  ashar: PrayerStatus;
  maghrib: PrayerStatus;
  isya: PrayerStatus;
  dhuha: DhuhaStatus;
}

export interface DailyRecord {
  id: string; // format: `${studentId}_${date}`
  studentId: string;
  date: string; // YYYY-MM-DD
  prayers: DailyStudentPrayer;
  mengaji?: MengajiEntry;
  catatanGuru?: string;
  parafGuru?: boolean;
  verifikasiOrtu?: boolean;
  namaOrtu?: string;
  catatanOrtu?: string;
  waktuValidasiOrtu?: string;
  poinHariIni?: number;
  updatedAt: string;
}

export interface Student {
  id: string;
  absen: number;
  nis: string;
  nama: string;
  kelas: string;
  gender: 'L' | 'P';
  fotoUrl?: string;
  noHpOrtu?: string;
  currentIqroOrSurah?: string;
}

export type StarLevel = 'none' | 'perunggu' | 'perak' | 'emas';

export interface StudentStats {
  totalPoints: number;
  starLevel: StarLevel;
  starCount: number; // 0, 1, 2, 3
  fardhuCompletedTotal: number; // total salat fardu terlaksana
  dhuhaCount: number; // total hari salat dhuha
  mengajiCount: number; // total hari mengaji
  weeklyFardhu: { done: number; total: number }; // misal 33/35
  weeklyDhuha: { done: number; total: number }; // misal 5/7
  weeklyMengaji: { done: number; total: number }; // misal 6/7
  kehadiranPersen: number; // % kehadiran ibadah
  verifiedByParentsCount: number;
}

export type ActiveTab =
  | 'dashboard'
  | 'checklist_fardu'
  | 'presensi_dhuha'
  | 'rekap_mengaji'
  | 'rekap_mingguan'
  | 'peringkat_bintang'
  | 'cetak_mutabaah';

