import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  Share2,
  CheckCircle,
  Clock,
  BookOpen,
  Sun,
  ShieldCheck,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { DailyRecord, FardhuPrayerKey, Student } from '../types';
import {
  DHUHA_STATUS_CONFIG,
  formatIndonesianDate,
  getDefaultPrayerRecord,
  KELANCARAN_CONFIG,
  PRAYER_NAMES,
  PRAYER_STATUS_CONFIG,
  generateWhatsAppReport,
} from '../utils/helpers';

interface ClassReportViewProps {
  students: Student[];
  records: Record<string, DailyRecord>;
  selectedDate: string;
}

export const ClassReportView: React.FC<ClassReportViewProps> = ({
  students,
  records,
  selectedDate,
}) => {
  const [selectedStudentForWa, setSelectedStudentForWa] = useState<Student | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const fardhuKeys: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  const handlePrint = () => {
    window.print();
  };

  const currentWaText = selectedStudentForWa
    ? generateWhatsAppReport(
        selectedStudentForWa,
        selectedDate,
        records[`${selectedStudentForWa.id}_${selectedDate}`]
      )
    : '';

  const handleCopyWa = () => {
    if (!currentWaText) return;
    navigator.clipboard.writeText(currentWaText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenWaLink = () => {
    if (!selectedStudentForWa) return;
    const phone = selectedStudentForWa.noHpOrtu?.replace(/\D/g, '') || '';
    const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(currentWaText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">Rekap Laporan Mutaba'ah Siswa</h2>
          <p className="text-xs text-slate-500">
            Cetak format lembar mutaba'ah untuk arsip sekolah atau bagikan laporan harian kepada orang tua via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Rekap (PDF/Print)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs print:border-none print:shadow-none print:p-0">
        
        {/* Document Header for Print */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
            LEMBAR REKAPITULASI MUTABA'AH YAUMIYAH SISWA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            PEMANTAUAN SHOLAT FARDHU 5 WAKTU, SHOLAT DHUHA, DAN MENGAJI AL-QUR'AN / IQRO'
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
            <span>Kelas: 4-A</span>
            <span>•</span>
            <span>Hari/Tanggal: {formatIndonesianDate(selectedDate)}</span>
            <span>•</span>
            <span>Guru Pembimbing: Zumrotun Nafisah, S.Pd.I</span>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 border border-slate-300 text-center w-8">No</th>
                <th className="p-2 border border-slate-300 w-44">Nama Siswa</th>
                <th className="p-2 border border-slate-300 text-center">Subuh</th>
                <th className="p-2 border border-slate-300 text-center">Dzuhur</th>
                <th className="p-2 border border-slate-300 text-center">Ashar</th>
                <th className="p-2 border border-slate-300 text-center">Maghrib</th>
                <th className="p-2 border border-slate-300 text-center">Isya</th>
                <th className="p-2 border border-slate-300 text-center bg-amber-50">Sholat Dhuha</th>
                <th className="p-2 border border-slate-300 bg-sky-50 min-w-[160px]">Setoran Mengaji</th>
                <th className="p-2 border border-slate-300 text-center w-16">Paraf</th>
                <th className="p-2 border border-slate-300 text-center w-24 print:hidden">Kirim WA</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const key = `${student.id}_${selectedDate}`;
                const rec = records[key];
                const prayers = rec?.prayers || getDefaultPrayerRecord();
                const mengaji = rec?.mengaji;

                return (
                  <tr key={student.id} className="hover:bg-slate-50 border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center font-medium">{idx + 1}</td>
                    <td className="p-2 border border-slate-300">
                      <div className="font-bold text-slate-900">{student.nama}</div>
                      <div className="text-[10px] text-slate-400">NIS: {student.nis}</div>
                    </td>

                    {/* Fardhu columns */}
                    {fardhuKeys.map((k) => {
                      const st = prayers[k];
                      const isGood = st === 'berjamaah';
                      const isMunfarid = st === 'munfarid';
                      const isUdzur = st === 'udzur';
                      return (
                        <td key={k} className="p-2 border border-slate-300 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isGood
                                ? 'bg-emerald-100 text-emerald-800'
                                : isMunfarid
                                ? 'bg-sky-100 text-sky-800'
                                : isUdzur
                                ? 'bg-purple-100 text-purple-800'
                                : st === 'terlambat'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {PRAYER_STATUS_CONFIG[st].shortLabel}
                          </span>
                        </td>
                      );
                    })}

                    {/* Dhuha */}
                    <td className="p-2 border border-slate-300 text-center bg-amber-50/40">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          prayers.dhuha !== 'tidak'
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {DHUHA_STATUS_CONFIG[prayers.dhuha].shortLabel}
                      </span>
                    </td>

                    {/* Mengaji */}
                    <td className="p-2 border border-slate-300 bg-sky-50/40">
                      {mengaji && mengaji.jilidOrSurah ? (
                        <div>
                          <div className="font-semibold text-slate-800">
                            {mengaji.jilidOrSurah} {mengaji.halamanOrAyat && `(${mengaji.halamanOrAyat})`}
                          </div>
                          <div className="text-[10px] text-sky-700">
                            Nilai: {KELANCARAN_CONFIG[mengaji.kelancaran]?.label.split(' ')[0]}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">-</span>
                      )}
                    </td>

                    {/* Paraf */}
                    <td className="p-2 border border-slate-300 text-center">
                      {rec?.parafGuru ? (
                        <span className="text-emerald-600 font-bold">✓ Guru</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* WA Action (hidden in print) */}
                    <td className="p-2 border border-slate-300 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForWa(student)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Lapor WA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Signature Box for Print */}
        <div className="mt-8 pt-6 hidden print:grid grid-cols-2 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold">Kepala Sekolah SD / MI</p>
            <div className="h-16"></div>
            <p className="font-bold underline">( ............................................ )</p>
            <p className="text-slate-500">NIP. ....................................</p>
          </div>
          <div>
            <p>Wali Kelas 4-A / Guru PAI,</p>
            <div className="h-16"></div>
            <p className="font-bold underline">Zumrotun Nafisah, S.Pd.I</p>
            <p className="text-slate-500">NIP. 198506122011012008</p>
          </div>
        </div>

      </div>

      {/* WhatsApp Modal for Selected Student */}
      {selectedStudentForWa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-emerald-700 px-5 py-3.5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Kirim Laporan Mutaba'ah via WhatsApp</h3>
                <p className="text-xs text-emerald-100">
                  Kepada Wali Murid dari {selectedStudentForWa.nama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForWa(null)}
                className="text-white hover:text-emerald-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-600">
                Format pesan telah tersusun otomatis dengan sopan dan lengkap. Anda dapat menyalin teks atau langsung membuka WhatsApp jika nomor HP tersimpan.
              </p>

              <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl max-h-60 overflow-y-auto text-slate-800">
                {currentWaText}
              </pre>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyWa}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Teks Pesan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenWaLink}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition inline-flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Sekarang ke WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
