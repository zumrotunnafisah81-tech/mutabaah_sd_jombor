import React from 'react';
import { CheckCircle, Sun, BookOpen, Clock, Award, Users, ShieldCheck } from 'lucide-react';
import { DailyRecord, Student } from '../types';
import { calculateDailyPoints } from '../utils/helpers';

interface StatsOverviewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  students,
  records,
  selectedDate,
}) => {
  const total = students.length;

  let countFardhuLengkap = 0; // 5 waktu lengkap
  let countDhuhaDone = 0; // Sholat Dhuha terlaksana
  let countMengajiDone = 0; // Mengaji sudah setor
  let countVerifiedOrtu = 0; // Sudah divalidasi ortu

  students.forEach((std) => {
    const key = `${std.id}_${selectedDate}`;
    const rec = records[key];
    if (rec) {
      const pts = calculateDailyPoints(rec.prayers, Boolean(rec.mengaji));
      if (pts.fardhuDoneCount === 5) {
        countFardhuLengkap++;
      }
      if (pts.isDhuhaDone) {
        countDhuhaDone++;
      }
      if (rec.mengaji && rec.mengaji.jilidOrSurah) {
        countMengajiDone++;
      }
      if (rec.verifikasiOrtu) {
        countVerifiedOrtu++;
      }
    }
  });

  const pctFardhu = total > 0 ? Math.round((countFardhuLengkap / total) * 100) : 0;
  const pctDhuha = total > 0 ? Math.round((countDhuhaDone / total) * 100) : 0;
  const pctMengaji = total > 0 ? Math.round((countMengajiDone / total) * 100) : 0;
  const pctVerified = total > 0 ? Math.round((countVerifiedOrtu / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6 print:hidden">
      
      {/* 1. Sholat Fardhu 5 Waktu */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Salat 5 Waktu
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{countFardhuLengkap}</span>
          <span className="text-xs font-medium text-slate-500">dari {total} siswa ({pctFardhu}%)</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${pctFardhu}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>Lengkap 5 waktu</span>
          <span className="text-emerald-700 font-semibold">{total - countFardhuLengkap} belum lengkap</span>
        </div>
      </div>

      {/* 2. Sholat Dhuha */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Salat Dhuha
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{countDhuhaDone}</span>
          <span className="text-xs font-medium text-slate-500">dari {total} siswa ({pctDhuha}%)</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${pctDhuha}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>Target pagi sekolah</span>
          <span className="text-amber-700 font-semibold">{total - countDhuhaDone} belum salat</span>
        </div>
      </div>

      {/* 3. Setoran Mengaji */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Setoran Mengaji
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{countMengajiDone}</span>
          <span className="text-xs font-medium text-slate-500">dari {total} siswa ({pctMengaji}%)</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${pctMengaji}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>Iqro & Al-Qur'an</span>
          <span className="text-sky-700 font-semibold">{total - countMengajiDone} belum setor</span>
        </div>
      </div>

      {/* 4. Validasi Orang Tua */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Validasi Orang Tua
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{countVerifiedOrtu}</span>
          <span className="text-xs font-medium text-slate-500">dari {total} siswa ({pctVerified}%)</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${pctVerified}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>Sinergi guru & wali</span>
          <span className="text-indigo-700 font-semibold">{countVerifiedOrtu} terverifikasi</span>
        </div>
      </div>

    </div>
  );
};
