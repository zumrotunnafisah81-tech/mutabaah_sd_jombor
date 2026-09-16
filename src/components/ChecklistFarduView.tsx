import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sparkles,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { DailyRecord, FardhuPrayerKey, PrayerStatus, Student } from '../types';
import {
  formatIndonesianDate,
  PRAYER_NAMES,
  PRAYER_STATUS_CONFIG,
  calculateDailyPoints,
} from '../utils/helpers';

interface ChecklistFarduViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onUpdatePrayerStatus: (studentId: string, prayer: FardhuPrayerKey, status: PrayerStatus) => void;
  onOpenCheckModal: (student: Student) => void;
  onOpenParentValidation: (student: Student) => void;
  onMarkAllClassFardhu: (prayer: FardhuPrayerKey, status: PrayerStatus) => void;
}

export const ChecklistFarduView: React.FC<ChecklistFarduViewProps> = ({
  students,
  records,
  selectedDate,
  onUpdatePrayerStatus,
  onOpenCheckModal,
  onOpenParentValidation,
  onMarkAllClassFardhu,
}) => {
  const [filterPrayer, setFilterPrayer] = useState<FardhuPrayerKey | 'all'>('all');
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<string | null>(null);

  const fardhuKeys: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  // Toggle status in cycle: 'berjamaah' -> 'munfarid' -> 'tidak' -> 'berjamaah'
  const cycleStatus = (current: PrayerStatus): PrayerStatus => {
    if (current === 'berjamaah') return 'munfarid';
    if (current === 'munfarid') return 'tidak';
    if (current === 'tidak') return 'berjamaah';
    return 'berjamaah';
  };

  // If a student history table is selected, show their 7-day log table matching the prompt format:
  // | Tanggal | Subuh | Zuhur | Asar | Magrib | Isya |
  const activeStudent = students.find((s) => s.id === selectedStudentHistory);

  // Generate 7 days for the student's table view
  const getDatesRange = () => {
    const dates = [];
    const base = new Date(selectedDate);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ✓
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Checklist Salat Fardu 5 Waktu Harian
                </h2>
                <p className="text-xs text-slate-500">
                  SD Negeri Jombor • Klik status atau centang tombol untuk memperbarui data salat siswa
                </p>
              </div>
            </div>
          </div>

          {/* Quick Mass Actions for Current Date */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Setel Zuhur Berjamaah:</span>
            <button
              type="button"
              onClick={() => onMarkAllClassFardhu('dzuhur', 'berjamaah')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition"
            >
              ✓ Zuhur Sekelas Berjamaah
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Fokus:
            </span>
            <button
              type="button"
              onClick={() => setFilterPrayer('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterPrayer === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua 5 Waktu
            </button>
            {fardhuKeys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilterPrayer(k)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  filterPrayer === k
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {PRAYER_NAMES[k]}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            💡 Tips: Klik badge status untuk mengubah secara cepat (Jamaah ➜ Sendiri ➜ Belum)
          </div>
        </div>
      </div>

      {/* Main Checklist Table (The Exact Table Format Requested) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tabel Salat Fardu: {formatIndonesianDate(selectedDate)}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total {students.length} Siswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 min-w-[180px]">Nama Siswa</th>
                {fardhuKeys
                  .filter((k) => filterPrayer === 'all' || filterPrayer === k)
                  .map((k) => (
                    <th key={k} className="py-2.5 px-2 text-center min-w-[90px]">
                      {PRAYER_NAMES[k]}
                    </th>
                  ))}
                <th className="py-2.5 px-3 text-center min-w-[100px]">Capaian</th>
                <th className="py-2.5 px-3 text-center min-w-[110px]">Validasi Ortu</th>
                <th className="py-2.5 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {students.map((student) => {
                const rec = records[`${student.id}_${selectedDate}`];
                const prayers = rec?.prayers || {
                  subuh: 'tidak',
                  dzuhur: 'tidak',
                  ashar: 'tidak',
                  maghrib: 'tidak',
                  isya: 'tidak',
                  dhuha: 'tidak',
                };
                const pts = calculateDailyPoints(prayers, Boolean(rec?.mengaji));
                const isFull5 = pts.fardhuDoneCount === 5;
                const isVerified = rec?.verifikasiOrtu;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* No Absen */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      {student.absen}
                    </td>

                    {/* Nama Siswa */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            student.gender === 'L'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {student.nama.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 line-clamp-1">
                            {student.nama}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            NIS: {student.nis} • Kelas {student.kelas}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sholat Fardhu Columns */}
                    {fardhuKeys
                      .filter((k) => filterPrayer === 'all' || filterPrayer === k)
                      .map((k) => {
                        const status = prayers[k];
                        const isDone = status === 'berjamaah' || status === 'munfarid';
                        const cfg = PRAYER_STATUS_CONFIG[status];

                        return (
                          <td key={k} className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => onUpdatePrayerStatus(student.id, k, cycleStatus(status))}
                              className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-semibold border transition-all flex items-center justify-center gap-1 ${
                                status === 'berjamaah'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold hover:bg-emerald-100'
                                  : status === 'munfarid'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100'
                                  : status === 'terlambat'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : status === 'udzur'
                                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={`Klik untuk ubah status sholat ${PRAYER_NAMES[k]}`}
                            >
                              {isDone ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : status === 'tidak' ? (
                                <span className="text-slate-300">✕</span>
                              ) : null}
                              <span>{cfg.shortLabel}</span>
                            </button>
                          </td>
                        );
                      })}

                    {/* Capaian */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        <span>{pts.fardhuDoneCount}/5</span>
                        {isFull5 && <span className="text-emerald-600">🌟</span>}
                      </div>
                    </td>

                    {/* Validasi Ortu */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenParentValidation(student)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {isVerified ? '✓ Tervalidasi' : '⏳ Menunggu'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenCheckModal(student)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium text-xs transition"
                          title="Detail Lengkap"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStudentHistory(
                              selectedStudentHistory === student.id ? null : student.id
                            )
                          }
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium text-xs transition"
                          title="Lihat Tabel Riwayat 7 Hari"
                        >
                          7 Hari
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student 7-Day History Table (matching the user example prompt table) */}
      {activeStudent && (
        <div className="bg-white border-2 border-sky-300 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                {activeStudent.absen}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tabel Mutaba'ah Mingguan: {activeStudent.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  Riwayat 7 hari pelaksanaan salat fardu (Contoh format buku mutaba'ah siswa)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStudentHistory(null)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Tutup Tabel Siswa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-r border-slate-200 min-w-[130px]">Tanggal</th>
                  <th className="p-2.5 border-b border-r border-slate-200 text-center">Subuh</th>
                  <th className="p-2.5 border-b border-r border-slate-200 text-center">Zuhur</th>
                  <th className="p-2.5 border-b border-r border-slate-200 text-center">Asar</th>
                  <th className="p-2.5 border-b border-r border-slate-200 text-center">Magrib</th>
                  <th className="p-2.5 border-b border-r border-slate-200 text-center">Isya</th>
                  <th className="p-2.5 border-b border-slate-200 text-center">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {getDatesRange().map((dStr) => {
                  const rec = records[`${activeStudent.id}_${dStr}`];
                  const pr = rec?.prayers;

                  const isSubuh = pr?.subuh === 'berjamaah' || pr?.subuh === 'munfarid';
                  const isDzuhur = pr?.dzuhur === 'berjamaah' || pr?.dzuhur === 'munfarid';
                  const isAshar = pr?.ashar === 'berjamaah' || pr?.ashar === 'munfarid';
                  const isMaghrib = pr?.maghrib === 'berjamaah' || pr?.maghrib === 'munfarid';
                  const isIsya = pr?.isya === 'berjamaah' || pr?.isya === 'munfarid';

                  return (
                    <tr
                      key={dStr}
                      className={dStr === selectedDate ? 'bg-sky-50 font-medium' : 'bg-white'}
                    >
                      <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">
                        {formatIndonesianDate(dStr).split(',')[0] + ', ' + dStr.slice(5)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        {isSubuh ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        {isDzuhur ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        {isAshar ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        {isMaghrib ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        {isIsya ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="p-2.5 text-center text-slate-500 text-[11px]">
                        {rec?.mengaji ? `${rec.mengaji.jilidOrSurah}` : 'Harian'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
