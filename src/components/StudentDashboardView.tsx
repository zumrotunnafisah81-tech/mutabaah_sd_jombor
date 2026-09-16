import React, { useState } from 'react';
import {
  User,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Sun,
  BookOpen,
  Send,
  ShieldCheck,
  Search,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { DailyRecord, Student } from '../types';
import {
  calculateStudentStats,
  formatIndonesianDate,
  generateWhatsAppReport,
  getStarBadge,
  PRAYER_NAMES,
} from '../utils/helpers';

interface StudentDashboardViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onOpenCheckModal: (student: Student) => void;
  onOpenParentValidation: (student: Student) => void;
  onSelectTab: (tab: any) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  students,
  records,
  selectedDate,
  onOpenCheckModal,
  onOpenParentValidation,
  onSelectTab,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      String(s.absen).includes(search)
  );

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const currentRecord = currentStudent
    ? records[`${currentStudent.id}_${selectedDate}`]
    : undefined;

  const stats = currentStudent
    ? calculateStudentStats(currentStudent.id, records, selectedDate)
    : null;

  const starBadge = stats ? getStarBadge(stats.totalPoints) : null;

  return (
    <div className="space-y-5">
      {/* Student Highlight Banner (Hero Profile matching Feature 1) */}
      {currentStudent && stats && starBadge && (
        <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Avatar / Foto, Nama, Kelas, Nomor Absen */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner border-2 border-white/30 ${
                    currentStudent.gender === 'L'
                      ? 'bg-linear-to-br from-sky-400 to-blue-600 text-white'
                      : 'bg-linear-to-br from-rose-400 to-pink-600 text-white'
                  }`}
                >
                  {currentStudent.nama.charAt(0)}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full border border-white shadow-xs">
                  #{currentStudent.absen}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-600/80 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                    Kelas {currentStudent.kelas}
                  </span>
                  <span className="text-xs text-emerald-200">
                    Nomor Absen: <strong>{currentStudent.absen}</strong>
                  </span>
                  <span className="text-xs text-emerald-300">
                    NIS: {currentStudent.nis}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white">
                  {currentStudent.nama}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-md font-bold border ${starBadge.badgeClass}`}>
                    {starBadge.name}
                  </span>
                  <span className="text-emerald-100/90 font-medium">
                    📖 Capaian: {currentStudent.currentIqroOrSurah || 'Iqro Jilid 1'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Persentase Kehadiran Ibadah & Action */}
            <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-400 flex items-center justify-center font-black text-lg text-white">
                  {stats.kehadiranPersen}%
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                    Kehadiran Ibadah
                  </div>
                  <div className="text-xs text-emerald-100 mt-0.5">
                    {stats.weeklyFardhu.done}/35 Fardu • {stats.weeklyDhuha.done}/7 Dhuha
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenCheckModal(currentStudent)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Isi / Edit Checklist Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => onOpenParentValidation(currentStudent)}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  {currentRecord?.verifikasiOrtu ? '✓ Sudah Divalidasi Ortu' : 'Validasi Orang Tua'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Grid of All Students (Interactive Switcher) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Daftar Seluruh Siswa SD Negeri Jombor (Kelas {students[0]?.kelas || '4-A'})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa atau no absen..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStudents.map((student) => {
            const isSelected = student.id === currentStudent?.id;
            const sStats = calculateStudentStats(student.id, records, selectedDate);
            const sBadge = getStarBadge(sStats.totalPoints);
            const sRec = records[`${student.id}_${selectedDate}`];

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`border rounded-2xl p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        student.gender === 'L'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {student.absen}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        {student.nama}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        Absen {student.absen} • NIS: {student.nis}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {sStats.kehadiranPersen}%
                    </span>
                  </div>
                </div>

                {/* Star & Verification indicator */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sBadge.badgeClass}`}>
                    {sBadge.name.split(' ')[0]} {sBadge.name.split(' ')[1]}
                  </span>

                  <span
                    className={`font-semibold ${
                      sRec?.verifikasiOrtu ? 'text-emerald-700' : 'text-amber-600'
                    }`}
                  >
                    {sRec?.verifikasiOrtu ? '✓ Sah Ortu' : '⏳ Belum Sah'}
                  </span>
                </div>

                {/* Quick Action Button */}
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    {sRec?.prayers?.dhuha !== 'tidak' ? '☀️ Dhuha ✓' : '☀️ Dhuha -'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCheckModal(student);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold text-xs transition"
                  >
                    Checklist
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
