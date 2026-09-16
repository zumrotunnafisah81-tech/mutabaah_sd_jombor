import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Award,
  BookMarked,
  Filter,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { DailyRecord, KelancaranLevel, Student } from '../types';
import { KELANCARAN_CONFIG, formatIndonesianDate } from '../utils/helpers';

interface MengajiRecapViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onOpenCheckModal: (student: Student) => void;
}

export const MengajiRecapView: React.FC<MengajiRecapViewProps> = ({
  students,
  records,
  selectedDate,
  onOpenCheckModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'setor' | 'belum_setor'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredStudents = students.filter((std) => {
    const match =
      std.nama.toLowerCase().includes(search.toLowerCase()) ||
      std.nis.includes(search) ||
      String(std.absen).includes(search);
    if (!match) return false;

    const rec = records[`${std.id}_${selectedDate}`];
    const hasSetor = Boolean(rec?.mengaji && rec.mengaji.jilidOrSurah);

    if (filterType === 'setor') return hasSetor;
    if (filterType === 'belum_setor') return !hasSetor;
    return true;
  });

  const total = students.length;
  const setorTodayCount = students.filter((std) => {
    const rec = records[`${std.id}_${selectedDate}`];
    return Boolean(rec?.mengaji && rec.mengaji.jilidOrSurah);
  }).length;

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-sky-700 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-sky-100" />
            </div>
            <h2 className="text-lg font-bold">Monitoring Mengaji Siswa (Iqro' & Al-Qur'an)</h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
            Catat tanggal, Surah/Juz/Jilid yang dibaca, halaman/ayat, serta tingkat kelancaran bacaan (Lancar, Cukup, atau Perlu Bimbingan).
          </p>
        </div>

        <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-3 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sky-200 font-semibold">
              Setoran Hari Ini
            </div>
            <div className="text-2xl font-bold">
              {setorTodayCount} <span className="text-sm font-normal text-sky-200">/ {total} Siswa</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full border-3 border-sky-300 flex items-center justify-center font-bold text-sm">
            {total > 0 ? Math.round((setorTodayCount / total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Controls & View Mode Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama siswa atau no absen..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'setor', label: 'Sudah Setor' },
              { id: 'belum_setor', label: 'Belum Setor' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterType(item.id as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  filterType === item.id
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'table'
                  ? 'bg-white text-sky-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel (Sesuai Format Mutaba'ah)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'cards'
                  ? 'bg-white text-sky-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Table Mode (Explicitly requested table format: | Tanggal | Bacaan | Halaman | Keterangan |) */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tabel Monitoring Mengaji ({formatIndonesianDate(selectedDate)})
            </div>
            <span className="text-xs text-slate-500">
              Format: Tanggal | Bacaan (Surah/Juz) | Halaman/Ayat | Kelancaran
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 min-w-[150px]">Nama Siswa</th>
                  <th className="py-2.5 px-3 min-w-[110px]">Tanggal</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Bacaan (Surah/Juz/Jilid)</th>
                  <th className="py-2.5 px-3 min-w-[100px]">Halaman / Ayat</th>
                  <th className="py-2.5 px-3 min-w-[130px] text-center">Keterangan / Kelancaran</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Catatan Guru</th>
                  <th className="py-2.5 px-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const key = `${student.id}_${selectedDate}`;
                  const rec = records[key];
                  const mengaji = rec?.mengaji;
                  const hasSetor = Boolean(mengaji && mengaji.jilidOrSurah);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        {student.absen}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              student.gender === 'L'
                                ? 'bg-sky-100 text-sky-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {student.nama.charAt(0)}
                          </div>
                          <span>{student.nama}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {selectedDate.slice(5)} ({formatIndonesianDate(selectedDate).split(',')[0]})
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {hasSetor && mengaji ? (
                          <div className="flex items-center gap-1.5">
                            <BookMarked className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{mengaji.jilidOrSurah}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal italic">
                            Belum setor (Target: {student.currentIqroOrSurah || 'Iqro Jilid 1'})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {hasSetor && mengaji?.halamanOrAyat ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
                            {mengaji.halamanOrAyat}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {hasSetor && mengaji ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              KELANCARAN_CONFIG[mengaji.kelancaran]?.badge ||
                              'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            {KELANCARAN_CONFIG[mengaji.kelancaran]?.label || 'Lancar'}
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-400">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px] italic max-w-xs truncate">
                        {hasSetor && mengaji?.catatan ? (
                          `"${mengaji.catatan}"`
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenCheckModal(student)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            hasSetor
                              ? 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                              : 'bg-sky-600 text-white hover:bg-sky-700 shadow-2xs'
                          }`}
                        >
                          {hasSetor ? 'Ubah' : '+ Catat'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mode 2: Card Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredStudents.map((student) => {
            const key = `${student.id}_${selectedDate}`;
            const rec = records[key];
            const mengaji = rec?.mengaji;
            const hasSetor = Boolean(mengaji && mengaji.jilidOrSurah);

            return (
              <div
                key={student.id}
                className={`bg-white border rounded-xl p-4 shadow-2xs transition-all ${
                  hasSetor
                    ? 'border-sky-300 bg-sky-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        student.gender === 'L'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {student.absen}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{student.nama}</h3>
                      <div className="text-xs text-slate-400">
                        Absen {student.absen} • NIS: {student.nis}
                      </div>
                    </div>
                  </div>

                  {hasSetor ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Setor
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                      Belum Setor
                    </span>
                  )}
                </div>

                {/* Recitation Content */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {hasSetor && mengaji ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-sky-600" />
                          <span className="font-bold text-sm text-slate-800">
                            {mengaji.jilidOrSurah}
                          </span>
                          {mengaji.halamanOrAyat && (
                            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {mengaji.halamanOrAyat}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                            KELANCARAN_CONFIG[mengaji.kelancaran]?.badge
                          }`}
                        >
                          {KELANCARAN_CONFIG[mengaji.kelancaran]?.label}
                        </span>
                      </div>

                      {mengaji.catatan && (
                        <div className="text-xs bg-slate-50 border border-slate-100 p-2 rounded-lg text-slate-700 italic flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          <span>"{mengaji.catatan}"</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 flex items-center justify-between py-1">
                      <div>
                        <span className="text-slate-400">Target/Capaian: </span>
                        <span className="font-semibold text-slate-700">
                          {student.currentIqroOrSurah || 'Iqro Jilid 1'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {hasSetor ? 'Klik untuk ubah evaluasi' : 'Belum dievaluasi hari ini'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCheckModal(student)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      hasSetor
                        ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200'
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-2xs'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{hasSetor ? 'Ubah Catatan' : 'Input Setoran'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
