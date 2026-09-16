import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Calendar,
  Check,
  User,
  School,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { DailyRecord, Student } from '../types';
import {
  formatIndonesianDate,
  PRAYER_NAMES,
  calculateStudentStats,
  getStarBadge,
} from '../utils/helpers';
import { SCHOOL_INFO } from '../data/initialData';

interface CetakMutabaahViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
}

export const CetakMutabaahView: React.FC<CetakMutabaahViewProps> = ({
  students,
  records,
  selectedDate,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [daysCount, setDaysCount] = useState<number>(7); // 7 hari atau 14 hari

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Generate list of dates backwards from selectedDate
  const generateDates = () => {
    const dates = [];
    const base = new Date(selectedDate);
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  };

  const datesList = generateDates();
  const stats = currentStudent
    ? calculateStudentStats(currentStudent.id, records, selectedDate)
    : null;
  const starBadge = stats ? getStarBadge(stats.totalPoints) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Control Bar (Hidden when printing) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Printer className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Cetak Lembar Buku Mutaba'ah Ibadah Siswa (PDF)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Siap cetak kertas A4 atau simpan sebagai PDF. Lengkap dengan kop sekolah, tabel harian, dan kolom tanda tangan guru & orang tua.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Filters */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih Siswa:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  Absen {s.absen} - {s.nama} ({s.kelas})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Rentang Tanggal Lembar:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDaysCount(7)}
                className={`flex-1 py-2 rounded-lg font-semibold border ${
                  daysCount === 7
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                1 Minggu (7 Hari)
              </button>
              <button
                type="button"
                onClick={() => setDaysCount(14)}
                className={`flex-1 py-2 rounded-lg font-semibold border ${
                  daysCount === 14
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                2 Minggu (14 Hari)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 White Page) */}
      <div className="bg-white border border-slate-300 shadow-lg rounded-xl p-6 sm:p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-sans">
        
        {/* Kop Surat Resmi SD Negeri Jombor */}
        <div className="border-b-2 border-slate-800 pb-3 mb-5 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Pemerintah Kabupaten Klaten • Dinas Pendidikan
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
            {SCHOOL_INFO.namaSekolah}
          </h1>
          <p className="text-[11px] text-slate-600">
            {SCHOOL_INFO.alamat}
          </p>
          <div className="inline-block bg-slate-800 text-white font-bold text-xs uppercase px-4 py-0.5 mt-2 rounded">
            LEMBAR MUTABA'AH SALAT & MENGAJI SISWA
          </div>
        </div>

        {/* Identitas Siswa */}
        {currentStudent && (
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs mb-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500 w-28 inline-block">Nama Lengkap</span>
              <span className="font-bold text-slate-900">: {currentStudent.nama}</span>
            </div>
            <div>
              <span className="text-slate-500 w-28 inline-block">Kelas / Absen</span>
              <span className="font-bold text-slate-900">
                : {currentStudent.kelas} / Nomor Absen {currentStudent.absen}
              </span>
            </div>
            <div>
              <span className="text-slate-500 w-28 inline-block">Nomor Induk (NIS)</span>
              <span className="font-bold text-slate-900">: {currentStudent.nis}</span>
            </div>
            <div>
              <span className="text-slate-500 w-28 inline-block">Tahun Ajaran</span>
              <span className="font-bold text-slate-900">: {SCHOOL_INFO.tahunAjaran}</span>
            </div>
            <div>
              <span className="text-slate-500 w-28 inline-block">Capaian Mengaji</span>
              <span className="font-bold text-slate-900">
                : {currentStudent.currentIqroOrSurah || 'Iqro'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 w-28 inline-block">Bintang Kebaikan</span>
              <span className="font-bold text-emerald-800">
                : {starBadge?.name} ({stats?.totalPoints} Poin)
              </span>
            </div>
          </div>
        )}

        {/* Tabel Mutaba'ah Fisik */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-[11px] border border-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold uppercase text-center border-b border-slate-800">
                <th rowSpan={2} className="border border-slate-800 p-1.5 w-8">No</th>
                <th rowSpan={2} className="border border-slate-800 p-1.5 min-w-[100px]">Hari / Tgl</th>
                <th colSpan={5} className="border border-slate-800 p-1">Salat Fardu (Centang ✓)</th>
                <th rowSpan={2} className="border border-slate-800 p-1.5 w-16">Dhuha</th>
                <th colSpan={3} className="border border-slate-800 p-1">Kegiatan Mengaji</th>
                <th rowSpan={2} className="border border-slate-800 p-1.5 w-20">Paraf Ortu</th>
              </tr>
              <tr className="bg-slate-50 text-slate-800 font-semibold text-center border-b border-slate-800">
                <th className="border border-slate-800 p-1 w-10">Sub</th>
                <th className="border border-slate-800 p-1 w-10">Zuh</th>
                <th className="border border-slate-800 p-1 w-10">Asr</th>
                <th className="border border-slate-800 p-1 w-10">Mag</th>
                <th className="border border-slate-800 p-1 w-10">Isy</th>
                <th className="border border-slate-800 p-1 min-w-[100px]">Surah / Jilid</th>
                <th className="border border-slate-800 p-1 w-16">Hal/Ayat</th>
                <th className="border border-slate-800 p-1 w-16">Kelancaran</th>
              </tr>
            </thead>
            <tbody>
              {datesList.map((dStr, idx) => {
                const rec = currentStudent ? records[`${currentStudent.id}_${dStr}`] : undefined;
                const pr = rec?.prayers;
                const mg = rec?.mengaji;

                const checkSubuh = pr?.subuh === 'berjamaah' || pr?.subuh === 'munfarid';
                const checkDzuhur = pr?.dzuhur === 'berjamaah' || pr?.dzuhur === 'munfarid';
                const checkAshar = pr?.ashar === 'berjamaah' || pr?.ashar === 'munfarid';
                const checkMaghrib = pr?.maghrib === 'berjamaah' || pr?.maghrib === 'munfarid';
                const checkIsya = pr?.isya === 'berjamaah' || pr?.isya === 'munfarid';
                const isDhuha = pr?.dhuha && pr?.dhuha !== 'tidak';

                return (
                  <tr key={dStr} className="border-b border-slate-400 text-center">
                    <td className="border border-slate-800 p-1 font-medium">{idx + 1}</td>
                    <td className="border border-slate-800 p-1 text-left whitespace-nowrap font-medium">
                      {formatIndonesianDate(dStr).split(',')[0].slice(0, 3)}, {dStr.slice(8)}/{dStr.slice(5, 7)}
                    </td>
                    <td className="border border-slate-800 p-1 font-bold">
                      {checkSubuh ? '✓' : ''}
                    </td>
                    <td className="border border-slate-800 p-1 font-bold">
                      {checkDzuhur ? '✓' : ''}
                    </td>
                    <td className="border border-slate-800 p-1 font-bold">
                      {checkAshar ? '✓' : ''}
                    </td>
                    <td className="border border-slate-800 p-1 font-bold">
                      {checkMaghrib ? '✓' : ''}
                    </td>
                    <td className="border border-slate-800 p-1 font-bold">
                      {checkIsya ? '✓' : ''}
                    </td>
                    <td className="border border-slate-800 p-1 text-[10px]">
                      {isDhuha ? (pr.dhuha === 'berjamaah_sekolah' ? 'Sekolah' : 'Ya') : '-'}
                    </td>
                    <td className="border border-slate-800 p-1 text-left text-[10px] truncate max-w-[120px]">
                      {mg?.jilidOrSurah || '-'}
                    </td>
                    <td className="border border-slate-800 p-1 text-[10px]">
                      {mg?.halamanOrAyat || '-'}
                    </td>
                    <td className="border border-slate-800 p-1 text-[10px]">
                      {mg?.kelancaran ? (mg.kelancaran === 'lancar' || mg.kelancaran === 'mumtaz' ? 'Lancar' : 'Cukup') : '-'}
                    </td>
                    <td className="border border-slate-800 p-1 text-[10px] font-semibold text-emerald-800">
                      {rec?.verifikasiOrtu ? '✓ Sah' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ringkasan & Petunjuk */}
        <div className="text-[11px] text-slate-600 mb-6 bg-slate-50 p-2.5 rounded border border-slate-200">
          <strong>Catatan Pembimbing:</strong> Berilah tanda centang (✓) pada kolom salat fardu jika ananda melaksanakan salat tepat waktu. Diharapkan Ayah/Bunda menandatangani buku mutaba'ah ini setiap pekan sebagai bentuk sinergi pendidikan ibadah antara madrasah/sekolah dan keluarga.
        </div>

        {/* Kolom Tanda Tangan 3 Pihak */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs mt-6 pt-4 border-t border-slate-300">
          <div>
            <div className="text-slate-500">Mengetahui,</div>
            <div className="font-bold text-slate-800">Orang Tua / Wali Siswa</div>
            <div className="h-16 flex items-end justify-center">
              <span className="border-b border-slate-700 w-36 inline-block">
                {records[`${currentStudent?.id}_${selectedDate}`]?.namaOrtu || ''}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">(Tanda Tangan & Nama Terang)</div>
          </div>

          <div>
            <div className="text-slate-500">Klaten, {formatIndonesianDate(selectedDate)}</div>
            <div className="font-bold text-slate-800">Guru Kelas / PAI</div>
            <div className="h-16 flex items-end justify-center">
              <span className="font-bold border-b border-slate-700 w-36 inline-block">
                {SCHOOL_INFO.guruKelas}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">NIP. {SCHOOL_INFO.nipGuru}</div>
          </div>

          <div>
            <div className="text-slate-500">Menyetujui,</div>
            <div className="font-bold text-slate-800">Kepala {SCHOOL_INFO.namaSekolah}</div>
            <div className="h-16 flex items-end justify-center">
              <span className="font-bold border-b border-slate-700 w-36 inline-block">
                {SCHOOL_INFO.kepalaSekolah}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">NIP. {SCHOOL_INFO.nipKepalaSekolah}</div>
          </div>
        </div>

      </div>
    </div>
  );
};
