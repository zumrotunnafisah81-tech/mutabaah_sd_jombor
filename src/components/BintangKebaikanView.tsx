import React, { useState } from 'react';
import {
  Award,
  Star,
  Sparkles,
  Trophy,
  Medal,
  ChevronUp,
  Share2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { DailyRecord, Student } from '../types';
import {
  calculateStudentStats,
  getStarBadge,
  generateWhatsAppReport,
} from '../utils/helpers';

interface BintangKebaikanViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onOpenCheckModal: (student: Student) => void;
}

export const BintangKebaikanView: React.FC<BintangKebaikanViewProps> = ({
  students,
  records,
  selectedDate,
  onOpenCheckModal,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'emas' | 'perak' | 'perunggu'>('all');

  const studentRankings = students.map((std) => {
    const stats = calculateStudentStats(std.id, records, selectedDate);
    const starBadge = getStarBadge(stats.totalPoints);
    return {
      student: std,
      stats,
      starBadge,
    };
  });

  // Sort descending by total points
  studentRankings.sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);

  const filteredRankings = studentRankings.filter((item) => {
    if (filterTier === 'all') return true;
    return item.starBadge.level === filterTier;
  });

  const goldCount = studentRankings.filter((s) => s.starBadge.level === 'emas').length;
  const silverCount = studentRankings.filter((s) => s.starBadge.level === 'perak').length;
  const bronzeCount = studentRankings.filter((s) => s.starBadge.level === 'perunggu').length;

  return (
    <div className="space-y-5">
      {/* Gamification Rules Banner */}
      <div className="bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/40 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-200" />
              </span>
              <h2 className="text-lg font-bold">Peringkat & Bintang Kebaikan Siswa</h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Memotivasi siswa SD Negeri Jombor dalam beribadah sehari-hari. Kumpulkan poin dari salat fardu, salat dhuha, dan mengaji untuk meraih tingkatan bintang!
            </p>
          </div>

          {/* Points Rules Pill Box */}
          <div className="bg-black/20 border border-white/20 rounded-xl p-3 text-xs space-y-1 shrink-0">
            <div className="font-bold text-amber-200 text-[11px] uppercase tracking-wider">
              Sistem Poin Ibadah:
            </div>
            <div className="flex items-center gap-3 text-white">
              <span>🕌 Salat Fardu: <strong>5 Poin</strong></span>
              <span>☀️ Dhuha: <strong>2 Poin</strong></span>
              <span>📖 Mengaji: <strong>3 Poin</strong></span>
            </div>
            <div className="text-[10px] text-amber-200/80">
              Maksimal 10 Poin per hari • Akumulasi mingguan & bulanan
            </div>
          </div>
        </div>

        {/* 3 Tier Showcases */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-500/40 text-center text-xs">
          <div className="bg-amber-900/40 border border-amber-400/40 rounded-xl p-2.5">
            <div className="font-bold text-amber-200 flex items-center justify-center gap-1">
              <span>⭐⭐⭐</span> Bintang Emas
            </div>
            <div className="text-[11px] text-amber-100/90 mt-0.5">Syarat: ≥ 150 Poin</div>
            <div className="mt-1 text-xs font-semibold bg-amber-400/20 text-amber-200 rounded py-0.5">
              {goldCount} Siswa Meraih
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-300/40 rounded-xl p-2.5">
            <div className="font-bold text-slate-200 flex items-center justify-center gap-1">
              <span>⭐⭐</span> Bintang Perak
            </div>
            <div className="text-[11px] text-slate-200/90 mt-0.5">Syarat: ≥ 100 Poin</div>
            <div className="mt-1 text-xs font-semibold bg-white/20 text-white rounded py-0.5">
              {silverCount} Siswa Meraih
            </div>
          </div>

          <div className="bg-orange-950/40 border border-orange-400/40 rounded-xl p-2.5">
            <div className="font-bold text-orange-200 flex items-center justify-center gap-1">
              <span>⭐</span> Bintang Perunggu
            </div>
            <div className="text-[11px] text-orange-100/90 mt-0.5">Syarat: ≥ 50 Poin</div>
            <div className="mt-1 text-xs font-semibold bg-orange-500/20 text-orange-200 rounded py-0.5">
              {bronzeCount} Siswa Meraih
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tiers */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Filter Tingkatan:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'Semua Siswa' },
            { id: 'emas', label: '⭐⭐⭐ Emas' },
            { id: 'perak', label: '⭐⭐ Perak' },
            { id: 'perunggu', label: '⭐ Perunggu' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterTier(item.id as any)}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                filterTier === item.id
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRankings.map(({ student, stats, starBadge }, index) => {
          const rank = studentRankings.findIndex((s) => s.student.id === student.id) + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={student.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-2xs transition-all relative overflow-hidden ${
                starBadge.level === 'emas'
                  ? 'border-amber-400 bg-amber-50/15'
                  : starBadge.level === 'perak'
                  ? 'border-slate-300'
                  : starBadge.level === 'perunggu'
                  ? 'border-orange-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Top Medal Ribbon */}
              {isTop3 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-lg shadow-2xs">
                  {rank === 1 ? '🥇 Juara 1' : rank === 2 ? '🥈 Juara 2' : '🥉 Juara 3'}
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    rank === 1
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : rank === 3
                      ? 'bg-orange-300 text-orange-950'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  #{rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      {student.nama}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    No Absen: {student.absen} • Kelas {student.kelas} • NIS {student.nis}
                  </div>

                  {/* Badge & Level */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${starBadge.badgeClass}`}
                    >
                      {starBadge.name}
                    </span>
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {stats.totalPoints} Poin
                    </span>
                  </div>

                  {/* Progress to next star level */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>{starBadge.nextLabel}</span>
                      <span className="font-semibold text-slate-700">
                        {starBadge.progressPct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          starBadge.level === 'emas'
                            ? 'bg-amber-500'
                            : starBadge.level === 'perak'
                            ? 'bg-slate-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${starBadge.progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-slate-400 text-[10px]">Fardu Terlaksana</div>
                      <div className="font-bold text-emerald-700">{stats.fardhuCompletedTotal} Waktu</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-slate-400 text-[10px]">Salat Dhuha</div>
                      <div className="font-bold text-sky-700">{stats.dhuhaCount} Hari</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-slate-400 text-[10px]">Mengaji</div>
                      <div className="font-bold text-teal-700">{stats.mengajiCount} Hari</div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Capaian: {student.currentIqroOrSurah || 'Iqro'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const waText = `🌟 *APRESIASI BINTANG KEBAIKAN SISWA*\n*SD NEGERI JOMBOR*\n\nSelamat kepada Ananda *${student.nama}* (Absen ${student.absen})!\nAtas keistiqomahannya dalam mendirikan salat dan mengaji, ananda telah meraih penghargaan:\n\n*${starBadge.name}*\nTotal Poin Ibadah: *${stats.totalPoints} Poin*\n\nTerus istiqomah ya ananda sholeh/sholehah!\n\n_Wali Kelas: Zumrotun Nafisah, S.Pd.I_`;
                        const phone = student.noHpOrtu?.replace(/\D/g, '') || '';
                        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                        window.open(
                          `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`,
                          '_blank'
                        );
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition"
                    >
                      <Send className="w-3 h-3" /> Kirim Bintang ke Ortu WA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
