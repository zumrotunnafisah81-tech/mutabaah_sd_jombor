import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Send,
  Edit3,
  Sun,
  ShieldCheck,
  Check,
  Filter,
} from 'lucide-react';
import { DailyRecord, FardhuPrayerKey, Student } from '../types';
import {
  calculateDailyPoints,
  DHUHA_STATUS_CONFIG,
  getDefaultPrayerRecord,
  KELANCARAN_CONFIG,
  PRAYER_NAMES,
  PRAYER_STATUS_CONFIG,
  generateWhatsAppReport,
} from '../utils/helpers';

interface StudentCardListProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onSelectStudent: (student: Student) => void;
  onQuickTogglePrayer: (
    studentId: string,
    prayerKey: FardhuPrayerKey,
    event: React.MouseEvent
  ) => void;
}

export const StudentCardList: React.FC<StudentCardListProps> = ({
  students,
  records,
  selectedDate,
  onSelectStudent,
  onQuickTogglePrayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'incomplete' | 'no_mengaji'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fardhuKeys: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchName =
      std.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.nis.includes(searchQuery);

    if (!matchName) return false;

    const rec = records[`${std.id}_${selectedDate}`];
    const pts = rec
      ? calculateDailyPoints(rec.prayers, Boolean(rec.mengaji))
      : { fardhuDoneCount: 0, isDhuhaDone: false };
    const hasMengaji = Boolean(rec?.mengaji && rec.mengaji.jilidOrSurah);

    if (statusFilter === 'complete') {
      return pts.fardhuDoneCount === 5;
    }
    if (statusFilter === 'incomplete') {
      return pts.fardhuDoneCount < 5;
    }
    if (statusFilter === 'no_mengaji') {
      return !hasMengaji;
    }
    return true;
  });

  const handleCopyWa = (std: Student, rec?: DailyRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = generateWhatsAppReport(std, selectedDate, rec);
    navigator.clipboard.writeText(text);
    setCopiedId(std.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NIS siswa..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'Semua Siswa' },
            { id: 'complete', label: 'Sholat Lengkap (5)' },
            { id: 'incomplete', label: 'Belum Lengkap' },
            { id: 'no_mengaji', label: 'Belum Mengaji' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === f.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student List Table/Cards */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Tidak ada siswa yang sesuai pencarian/filter</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter di atas.</p>
          </div>
        ) : (
          filteredStudents.map((student, idx) => {
            const key = `${student.id}_${selectedDate}`;
            const rec = records[key];
            const prayers = rec?.prayers || getDefaultPrayerRecord();
            const pts = calculateDailyPoints(prayers, Boolean(rec?.mengaji));
            const mengaji = rec?.mengaji;
            const hasMengaji = Boolean(mengaji && mengaji.jilidOrSurah);

            return (
              <div
                key={student.id}
                className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Student Info */}
                <div className="flex items-start gap-3 min-w-[240px]">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      student.gender === 'L'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {student.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm">{student.nama}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        NIS {student.nis}
                      </span>
                      {rec?.parafGuru && (
                        <span title="Sudah diperiksa guru" className="text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>Kelas {student.kelas}</span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">
                        {pts.fardhuDoneCount}/5 Sholat Fardhu
                      </span>
                    </div>

                    {/* Mengaji status teaser */}
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      {hasMengaji ? (
                        <span className="text-sky-800 font-medium">
                          {mengaji?.jilidOrSurah} {mengaji?.halamanOrAyat && `(${mengaji.halamanOrAyat})`}
                          {mengaji?.kelancaran && (
                            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                              {KELANCARAN_CONFIG[mengaji.kelancaran]?.label.split(' ')[0]}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum ada setoran mengaji</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Sholat 5 Waktu & Dhuha Indicators */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {fardhuKeys.map((pKey) => {
                    const status = prayers[pKey];
                    const cfg = PRAYER_STATUS_CONFIG[status];
                    const isDone = status === 'berjamaah' || status === 'munfarid';

                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={(e) => onQuickTogglePrayer(student.id, pKey, e)}
                        title={`Klik untuk rotasi status Sholat ${PRAYER_NAMES[pKey]}: Saat ini ${cfg.label}`}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1 transition ${
                          status === 'berjamaah'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : status === 'munfarid'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : status === 'terlambat'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : status === 'udzur'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <span className="font-bold">{PRAYER_NAMES[pKey].slice(0, 3)}</span>
                        <span className="text-[10px] font-normal opacity-90">
                          {cfg.shortLabel}
                        </span>
                      </button>
                    );
                  })}

                  {/* Dhuha indicator */}
                  <div
                    title={`Sholat Dhuha: ${DHUHA_STATUS_CONFIG[prayers.dhuha].label}`}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1 ${
                      prayers.dhuha !== 'tidak'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Dhuha</span>
                    <span className="text-[10px] font-normal opacity-90">
                      {DHUHA_STATUS_CONFIG[prayers.dhuha].shortLabel}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                  {/* Copy WhatsApp button */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyWa(student, rec, e)}
                    title="Salin Pesan WhatsApp untuk Orang Tua"
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition"
                  >
                    {copiedId === student.id ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Tersalin
                      </span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>

                  {/* Primary Edit / Check button */}
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Cek & Catat</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
