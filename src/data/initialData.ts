import { Student, DailyRecord } from '../types';

export const SCHOOL_INFO = {
  namaSekolah: 'SD Negeri Jombor',
  kelasDefault: 'Kelas 4-A',
  tahunAjaran: 'Tahun Ajaran 2026/2027',
  guruKelas: 'Zumrotun Nafisah, S.Pd.I',
  nipGuru: '19880512 201402 2 003',
  kepalaSekolah: 'H. Sudarsono, M.Pd.',
  nipKepalaSekolah: '19760315 200212 1 004',
  alamat: 'Jl. Pemuda No. 45 Jombor, Kec. Ceper, Kab. Klaten',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-01',
    absen: 1,
    nis: '2026001',
    nama: 'Ahmad Faiz Al-Ghifari',
    kelas: '4-A',
    gender: 'L',
    noHpOrtu: '081234567801',
    currentIqroOrSurah: 'Al-Qur\'an Juz 1 (QS. Al-Baqarah: 25)',
  },
  {
    id: 'std-02',
    absen: 2,
    nis: '2026002',
    nama: 'Aisyah Humaira Putri',
    kelas: '4-A',
    gender: 'P',
    noHpOrtu: '081234567802',
    currentIqroOrSurah: 'Al-Qur\'an Juz 30 (QS. An-Naba: 1-20)',
  },
  {
    id: 'std-03',
    absen: 3,
    nis: '2026003',
    nama: 'Bilal Habibi Ramadhan',
    kelas: '4-A',
    gender: 'L',
    noHpOrtu: '081234567803',
    currentIqroOrSurah: 'Iqro Jilid 5 Hal 18',
  },
  {
    id: 'std-04',
    absen: 4,
    nis: '2026004',
    nama: 'Fatimah Az-Zahra',
    kelas: '4-A',
    gender: 'P',
    noHpOrtu: '081234567804',
    currentIqroOrSurah: 'Al-Qur\'an Juz 30 (QS. Al-Mulk: 1-30)',
  },
  {
    id: 'std-05',
    absen: 5,
    nis: '2026005',
    nama: 'Muhammad Rayyan Pratama',
    kelas: '4-A',
    gender: 'L',
    noHpOrtu: '081234567805',
    currentIqroOrSurah: 'Iqro Jilid 4 Hal 12',
  },
  {
    id: 'std-06',
    absen: 6,
    nis: '2026006',
    nama: 'Nadhira Shafa Salsabila',
    kelas: '4-A',
    gender: 'P',
    noHpOrtu: '081234567806',
    currentIqroOrSurah: 'Al-Qur\'an Juz 1 (QS. Al-Baqarah: 1-15)',
  },
  {
    id: 'std-07',
    absen: 7,
    nis: '2026007',
    nama: 'Rizky Al-Fatih',
    kelas: '4-A',
    gender: 'L',
    noHpOrtu: '081234567807',
    currentIqroOrSurah: 'Iqro Jilid 6 Hal 24',
  },
  {
    id: 'std-08',
    absen: 8,
    nis: '2026008',
    nama: 'Zahra Syakira Rahma',
    kelas: '4-A',
    gender: 'P',
    noHpOrtu: '081234567808',
    currentIqroOrSurah: 'Iqro Jilid 5 Hal 9',
  },
  {
    id: 'std-09',
    absen: 9,
    nis: '2026009',
    nama: 'Umar Khalid Robbani',
    kelas: '4-A',
    gender: 'L',
    noHpOrtu: '081234567809',
    currentIqroOrSurah: 'Al-Qur\'an Juz 2 (QS. Al-Baqarah: 165)',
  },
  {
    id: 'std-10',
    absen: 10,
    nis: '2026010',
    nama: 'Khadijah Najwa Mumtazah',
    kelas: '4-A',
    gender: 'P',
    noHpOrtu: '081234567810',
    currentIqroOrSurah: 'Iqro Jilid 4 Hal 22',
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  return getDateOffsetString(-1);
}

export function generateInitialRecords(): Record<string, DailyRecord> {
  const today = getTodayDateString();
  const records: Record<string, DailyRecord> = {};

  // Generate 7 days of realistic history (from -6 days ago to today)
  for (let offset = -6; offset <= 0; offset++) {
    const dStr = getDateOffsetString(offset);
    const isToday = offset === 0;

    // Student 1: Ahmad Faiz (Very active, high points, gold star)
    records[`std-01_${dStr}`] = {
      id: `std-01_${dStr}`,
      studentId: 'std-01',
      date: dStr,
      prayers: {
        subuh: 'berjamaah',
        dzuhur: 'berjamaah',
        ashar: 'berjamaah',
        maghrib: 'berjamaah',
        isya: offset % 3 === 0 ? 'munfarid' : 'berjamaah',
        dhuha: 'berjamaah_sekolah',
      },
      mengaji: {
        type: 'quran',
        jilidOrSurah: 'QS. Al-Baqarah',
        halamanOrAyat: `Ayat ${20 + offset * 3}-${25 + offset * 3}`,
        kelancaran: 'lancar',
        catatan: 'Makhraj huruf ra dan dzo sangat baik, tartil.',
      },
      catatanGuru: 'Sangat disiplin dan istiqomah.',
      parafGuru: true,
      verifikasiOrtu: true,
      namaOrtu: 'Bpk. Hendro & Ibu Siti',
      catatanOrtu: 'Alhamdulillah ananda sholat subuh tepat waktu di masjid.',
      updatedAt: new Date().toISOString(),
    };

    // Student 2: Aisyah Humaira (Silver star)
    records[`std-02_${dStr}`] = {
      id: `std-02_${dStr}`,
      studentId: 'std-02',
      date: dStr,
      prayers: {
        subuh: 'berjamaah',
        dzuhur: 'berjamaah',
        ashar: 'munfarid',
        maghrib: 'berjamaah',
        isya: 'berjamaah',
        dhuha: '4_rakaat',
      },
      mengaji: {
        type: 'juz_amma',
        jilidOrSurah: 'QS. An-Naba',
        halamanOrAyat: `Ayat ${1 + Math.abs(offset) * 4}-${10 + Math.abs(offset) * 4}`,
        kelancaran: 'lancar',
        catatan: 'Hafalan lancar, tajwid mad jaiz munfashil diperhatikan.',
      },
      catatanGuru: 'Alhamdulillah hafalan bertambah.',
      parafGuru: true,
      verifikasiOrtu: true,
      namaOrtu: 'Ibu Rahmawati',
      catatanOrtu: 'Sudah disimak mengaji di rumah.',
      updatedAt: new Date().toISOString(),
    };

    // Student 3: Bilal Habibi (Bronze star)
    records[`std-03_${dStr}`] = {
      id: `std-03_${dStr}`,
      studentId: 'std-03',
      date: dStr,
      prayers: {
        subuh: offset === -2 ? 'tidak' : 'munfarid',
        dzuhur: 'berjamaah',
        ashar: 'munfarid',
        maghrib: 'berjamaah',
        isya: offset === -4 ? 'tidak' : 'munfarid',
        dhuha: '2_rakaat',
      },
      mengaji: offset % 2 === 0 ? {
        type: 'iqro',
        jilidOrSurah: 'Iqro Jilid 5',
        halamanOrAyat: `Halaman ${14 + Math.abs(offset)}`,
        kelancaran: 'cukup',
        catatan: 'Latihan dengung (ghunnah) mim dan nun bertasydid.',
      } : undefined,
      catatanGuru: 'Tingkatkan lagi ya hafalan dan sholat isyanya.',
      parafGuru: true,
      verifikasiOrtu: offset >= -3,
      namaOrtu: 'Bpk. Ahmad Fauzi',
      updatedAt: new Date().toISOString(),
    };

    // Student 4: Fatimah Az-Zahra (QS. Al-Mulk - Gold star)
    records[`std-04_${dStr}`] = {
      id: `std-04_${dStr}`,
      studentId: 'std-04',
      date: dStr,
      prayers: {
        subuh: 'berjamaah',
        dzuhur: 'berjamaah',
        ashar: 'berjamaah',
        maghrib: 'berjamaah',
        isya: 'berjamaah',
        dhuha: '4_rakaat',
      },
      mengaji: {
        type: 'quran',
        jilidOrSurah: 'QS. Al-Mulk',
        halamanOrAyat: 'Ayat 1-30',
        kelancaran: 'lancar',
        catatan: 'Bacaan tartil dan merdu, masyaAllah.',
      },
      catatanGuru: 'Bagus sekali, terus dipertahankan.',
      parafGuru: true,
      verifikasiOrtu: true,
      namaOrtu: 'Ibu Maryam',
      catatanOrtu: 'Murojaah rutin setiap ba\'da maghrib.',
      updatedAt: new Date().toISOString(),
    };

    // Student 5: Muhammad Rayyan
    records[`std-05_${dStr}`] = {
      id: `std-05_${dStr}`,
      studentId: 'std-05',
      date: dStr,
      prayers: {
        subuh: offset === -1 ? 'terlambat' : 'munfarid',
        dzuhur: 'berjamaah',
        ashar: 'munfarid',
        maghrib: 'berjamaah',
        isya: 'munfarid',
        dhuha: 'berjamaah_sekolah',
      },
      mengaji: {
        type: 'iqro',
        jilidOrSurah: 'Iqro Jilid 4',
        halamanOrAyat: `Halaman ${10 + Math.abs(offset)}`,
        kelancaran: 'cukup',
        catatan: 'Perhatikan panjang 2 harakat mad thobi\'i.',
      },
      catatanGuru: 'Bangun subuh lebih awal ya.',
      parafGuru: true,
      verifikasiOrtu: offset >= -2,
      namaOrtu: 'Bpk. Wawan',
      updatedAt: new Date().toISOString(),
    };
  }

  return records;
}

export const INITIAL_RECORDS: Record<string, DailyRecord> = generateInitialRecords();
