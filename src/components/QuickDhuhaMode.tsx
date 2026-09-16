import React from 'react';
import {
  Sun,
  CheckCircle2,
  Users,
  Sparkles,
  Info,
  School,
  Check,
} from 'lucide-react';
import { DailyRecord, DhuhaStatus, Student } from '../types';
import { getDefaultPrayerRecord } from '../utils/helpers';

interface QuickDhuhaModeProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onUpdateDhuhaStatus: (studentId: string, status: DhuhaStatus) => void;
  onMarkAllDhuhaSchool: () => void;
  onResetAllDhuha: () => void;
}

export const QuickDhuhaMode: React.FC<QuickDhuhaModeProps> = ({
  students,
  records,
  selectedDate,
  onUpdateDhuhaStatus,
  onMarkAllDhuhaSchool,
  onResetAllDhuha,
}) => {
  const total = students.length;
  let doneCount = 0;

  students.forEach((std) => {
    const key = `${std.id}_${selectedDate}`;
    const rec = records[key];
    if (rec && rec.prayers.dhuha !== 'tidak') {
      doneCount++;
    }
  });

  return (
    <div className="space-y-4">
      {/* Banner / Guide */}
      <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-400/30 rounded-lg">
              <Sun className="w-5 h-5 text-amber-100" />
            </span>
            <h2 className="text-lg font-bold">Presensi Cepat Sholat Dhuha Pagi</h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Fitur praktis bagi guru pendamping saat sholat Dhuha bersama di mushola sekolah.
            Tandai seluruh kelas hanya dengan satu sentuhan, lalu sesuaikan siswa yang udzur atau absen.
          </p>
        </div>

        {/* Counter Card */}
        <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-100 font-semibold">
              Sudah Melaksanakan
            </div>
            <div className="text-2xl font-black">
              {doneCount} <span className="text-sm font-normal text-amber-200">/ {total} Siswa</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-amber-300 flex items-center justify-center font-bold text-sm">
            {total > 0 ? Math.round((doneCount / total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Batch Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <School className="w-4 h-4 text-emerald-600" />
          <span>Aksi Masal Kelas:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllDhuhaSchool}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tandai Semua Dhuha di Sekolah
          </button>
          <button
            type="button"
            onClick={onResetAllDhuha}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition"
          >
            Reset Status Dhuha
          </button>
        </div>
      </div>

      {/* Student Dhuha Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {students.map((student, idx) => {
          const key = `${student.id}_${selectedDate}`;
          const rec = records[key];
          const currentStatus: DhuhaStatus = rec?.prayers?.dhuha || 'tidak';
          const isDone = currentStatus !== 'tidak';

          return (
            <div
              key={student.id}
              className={`border rounded-xl p-3.5 transition-all bg-white ${
                isDone
                  ? 'border-amber-300 shadow-xs bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      student.gender === 'L'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {student.absen || idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {student.nama}
                    </h4>
                    <span className="text-[11px] text-slate-400">Absen {student.absen || idx + 1} • NIS: {student.nis}</span>
                  </div>
                </div>

                {isDone && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                    ✓ Sudah
                  </span>
                )}
              </div>

              {/* Status Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateDhuhaStatus(student.id, 'berjamaah_sekolah')}
                  className={`p-1.5 rounded-lg font-medium text-[11px] border text-center transition ${
                    currentStatus === 'berjamaah_sekolah'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏫 Sekolah
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDhuhaStatus(student.id, '2_rakaat')}
                  className={`p-1.5 rounded-lg font-medium text-[11px] border text-center transition ${
                    currentStatus === '2_rakaat'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌤️ 2 Rakaat
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDhuhaStatus(student.id, '4_rakaat')}
                  className={`p-1.5 rounded-lg font-medium text-[11px] border text-center transition ${
                    currentStatus === '4_rakaat'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ☀️ 4 Rakaat
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDhuhaStatus(student.id, '8_rakaat')}
                  className={`p-1.5 rounded-lg font-medium text-[11px] border text-center transition ${
                    currentStatus === '8_rakaat'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌟 8 Rakaat
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDhuhaStatus(student.id, 'tidak')}
                  className={`p-1.5 rounded-lg font-medium text-[11px] border text-center transition ${
                    currentStatus === 'tidak'
                      ? 'bg-slate-200 text-slate-700 border-slate-300 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ⚪ Belum
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
