import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Award,
  Send,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DailyRecord, Student } from '../types';
import {
  calculateStudentStats,
  formatIndonesianDate,
  generateWhatsAppReport,
  getStarBadge,
} from '../utils/helpers';
import { SCHOOL_INFO } from '../data/initialData';

interface WeeklyRecapViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onOpenCheckModal: (student: Student) => void;
  onOpenParentValidation: (student: Student) => void;
}

export const WeeklyRecapView: React.FC<WeeklyRecapViewProps> = ({
  students,
  records,
  selectedDate,
  onOpenCheckModal,
  onOpenParentValidation,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Calculate stats for all students
  const studentStatsList = students.map((std) => ({
    student: std,
    stats: calculateStudentStats(std.id, records, selectedDate),
  }));

  // Sort by highest weekly compliance or points
  studentStatsList.sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);

  const selectedStudentData = studentStatsList.find(
    (item) => item.student.id === selectedStudentId
  );

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-700/80 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </span>
            <h2 className="text-lg font-bold">Rekap Mingguan Mutaba'ah Ibadah Siswa</h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Pantauan komprehensif 7 hari terakhir: rasio keterlaksanaan salat fardu (35 waktu), salat dhuha (7 hari), dan kegiatan mengaji (7 hari).
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-3 text-xs flex items-center gap-3">
          <div>
            <div className="text-emerald-200 font-medium">Periode Evaluasi 7 Hari:</div>
            <div className="font-bold text-sm text-white">
              Sampai {formatIndonesianDate(selectedDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Weekly Recap Table (The Exact Requirements 33/35, 5/7, 6/7) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tabel Rekapitulasi Mingguan Kelas {students[0]?.kelas || '4-A'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Standar Target: Fardu (35), Dhuha (7), Mengaji (7)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-3 min-w-[170px]">Nama Siswa</th>
                <th className="py-3 px-3 text-center min-w-[120px]">
                  Salat Fardu
                  <span className="block text-[10px] font-normal text-slate-400">Target: /35</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">
                  Salat Dhuha
                  <span className="block text-[10px] font-normal text-slate-400">Target: /7</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">
                  Mengaji
                  <span className="block text-[10px] font-normal text-slate-400">Target: /7</span>
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">Ketercapaian</th>
                <th className="py-3 px-3 text-center min-w-[140px]">Bintang Kebaikan</th>
                <th className="py-3 px-3 text-center min-w-[110px]">Verifikasi Ortu</th>
                <th className="py-3 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentStatsList.map(({ student, stats }) => {
                const starBadge = getStarBadge(stats.totalPoints);
                const recToday = records[`${student.id}_${selectedDate}`];
                const isFardhuExcellent = stats.weeklyFardhu.done >= 30;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    {/* Absen */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      {student.absen}
                    </td>

                    {/* Nama */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{student.nama}</div>
                      <div className="text-[10px] text-slate-400">
                        NIS: {student.nis} • {student.currentIqroOrSurah || 'Iqro'}
                      </div>
                    </td>

                    {/* Fardhu (e.g. 33/35) */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            isFardhuExcellent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {stats.weeklyFardhu.done}/{stats.weeklyFardhu.total}
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((stats.weeklyFardhu.done / 35) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Dhuha (e.g. 5/7) */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {stats.weeklyDhuha.done}/{stats.weeklyDhuha.total}
                        </span>
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-sky-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((stats.weeklyDhuha.done / 7) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Mengaji (e.g. 6/7) */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                          {stats.weeklyMengaji.done}/{stats.weeklyMengaji.total}
                        </span>
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((stats.weeklyMengaji.done / 7) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Kehadiran Persen */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-800">
                        {stats.kehadiranPersen}%
                      </span>
                    </td>

                    {/* Bintang Kebaikan */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${starBadge.badgeClass}`}
                      >
                        {starBadge.name} ({stats.totalPoints} Poin)
                      </span>
                    </td>

                    {/* Verifikasi Ortu */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenParentValidation(student)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          recToday?.verifikasiOrtu
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {recToday?.verifikasiOrtu ? '✓ Terverifikasi' : 'Belum'}
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentId(student.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        Lihat Rapor
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Rapor Mingguan Siswa Terpilih */}
      {selectedStudentData && (
        <div className="bg-white border-2 border-emerald-400 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
                {selectedStudentData.student.absen}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rapor Mutaba'ah Mingguan: {selectedStudentData.student.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  {SCHOOL_INFO.namaSekolah} • Kelas {selectedStudentData.student.kelas} • NIS {selectedStudentData.student.nis}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStudentId(null)}
              className="text-xs px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Tutup Rapor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <div className="text-xs text-emerald-800 font-medium">Salat Fardu Terlaksana</div>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">
                {selectedStudentData.stats.weeklyFardhu.done} / 35
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                {Math.round((selectedStudentData.stats.weeklyFardhu.done / 35) * 100)}% ketercapaian 7 hari
              </div>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-center">
              <div className="text-xs text-sky-800 font-medium">Salat Dhuha Terlaksana</div>
              <div className="text-2xl font-black text-sky-900 mt-0.5">
                {selectedStudentData.stats.weeklyDhuha.done} / 7 Hari
              </div>
              <div className="text-[11px] text-sky-700 mt-1">
                {Math.round((selectedStudentData.stats.weeklyDhuha.done / 7) * 100)}% ketercapaian 7 hari
              </div>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-center">
              <div className="text-xs text-teal-800 font-medium">Setoran Mengaji</div>
              <div className="text-2xl font-black text-teal-900 mt-0.5">
                {selectedStudentData.stats.weeklyMengaji.done} / 7 Hari
              </div>
              <div className="text-[11px] text-teal-700 mt-1">
                {Math.round((selectedStudentData.stats.weeklyMengaji.done / 7) * 100)}% ketercapaian 7 hari
              </div>
            </div>
          </div>

          {/* Evaluasi Mingguan untuk Orang Tua */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">
              Evaluasi & Catatan Guru Kelas untuk Orang Tua:
            </h4>
            <p className="text-slate-700 leading-relaxed">
              "Alhamdulillah ananda {selectedStudentData.student.nama} telah menuntaskan{' '}
              <strong className="text-emerald-700">
                {selectedStudentData.stats.weeklyFardhu.done} dari 35 waktu salat fardu
              </strong>{' '}
              minggu ini, serta melaksanakan salat Dhuha sebanyak{' '}
              <strong className="text-sky-700">{selectedStudentData.stats.weeklyDhuha.done} hari</strong>.
              Dalam mengaji telah mencapai target{' '}
              <strong className="text-teal-700">{selectedStudentData.student.currentIqroOrSurah}</strong>.
              Mohon kerja sama Ayah dan Bunda untuk terus membimbing ananda istiqomah di rumah."
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>Wali Kelas: {SCHOOL_INFO.guruKelas}</span>
              <button
                type="button"
                onClick={() => {
                  const waText = generateWhatsAppReport(
                    selectedStudentData.student,
                    selectedDate,
                    records[`${selectedStudentData.student.id}_${selectedDate}`],
                    selectedStudentData.stats
                  );
                  const phone = selectedStudentData.student.noHpOrtu?.replace(/\D/g, '') || '';
                  const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                  window.open(
                    `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`,
                    '_blank'
                  );
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Kirim Rapor ke WhatsApp Wali Murid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
