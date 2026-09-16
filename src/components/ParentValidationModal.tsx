import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Heart, Send, Sparkles } from 'lucide-react';
import { DailyRecord, Student } from '../types';
import { formatIndonesianDate, generateWhatsAppReport, calculateStudentStats } from '../utils/helpers';

interface ParentValidationModalProps {
  student: Student | null;
  date: string;
  record?: DailyRecord;
  records: Record<string, DailyRecord>;
  isOpen: boolean;
  onClose: () => void;
  onSaveValidation: (studentId: string, date: string, isVerified: boolean, namaOrtu: string, catatanOrtu: string) => void;
}

export const ParentValidationModal: React.FC<ParentValidationModalProps> = ({
  student,
  date,
  record,
  records,
  isOpen,
  onClose,
  onSaveValidation,
}) => {
  if (!isOpen || !student) return null;

  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [namaOrtu, setNamaOrtu] = useState<string>('');
  const [catatanOrtu, setCatatanOrtu] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      setIsVerified(record.verifikasiOrtu ?? true);
      setNamaOrtu(record.namaOrtu || 'Orang Tua / Wali');
      setCatatanOrtu(record.catatanOrtu || '');
    } else {
      setIsVerified(true);
      setNamaOrtu('Orang Tua / Wali');
      setCatatanOrtu('');
    }
    setCopied(false);
  }, [record, student, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveValidation(student.id, date, isVerified, namaOrtu, catatanOrtu);
    onClose();
  };

  const stats = calculateStudentStats(student.id, records, date);
  const waText = generateWhatsAppReport(student, date, record, stats);

  const handleCopyWa = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const phone = student.noHpOrtu?.replace(/\D/g, '') || '';
    const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-indigo-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Validasi & Verifikasi Orang Tua</h2>
              <p className="text-xs text-indigo-200">SD Negeri Jombor • Mutaba'ah Harian</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950">
            <div className="flex items-center justify-between font-bold text-indigo-900">
              <span>{student.nama} (Absen {student.absen})</span>
              <span>{formatIndonesianDate(date)}</span>
            </div>
            <p className="mt-1 text-indigo-800">
              Dengan memverifikasi, orang tua menyatakan bahwa ananda benar telah melaksanakan salat fardu, dhuha, dan mengaji sesuai catatan hari ini.
            </p>
          </div>

          {/* Verification Status Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Status Verifikasi Orang Tua:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsVerified(true)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isVerified
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Sudah Diverifikasi
              </button>

              <button
                type="button"
                onClick={() => setIsVerified(false)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                  !isVerified
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>⏳</span>
                Menunggu Verifikasi
              </button>
            </div>
          </div>

          {/* Nama Orang Tua */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Orang Tua / Wali:
            </label>
            <input
              type="text"
              value={namaOrtu}
              onChange={(e) => setNamaOrtu(e.target.value)}
              placeholder="Contoh: Bpk. Ahmad / Ibu Siti"
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Catatan Orang Tua */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pesan / Catatan Orang Tua untuk Guru (Opsional):
            </label>
            <textarea
              rows={2}
              value={catatanOrtu}
              onChange={(e) => setCatatanOrtu(e.target.value)}
              placeholder="Contoh: Alhamdulillah hari ini ananda rajin sholat berjamaah di masjid bersama ayah."
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick WhatsApp Share Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Laporan WA Wali Murid:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyWa}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                {copied ? '✓ Tersalin' : 'Salin Format WA'}
              </button>
              {student.noHpOrtu && (
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Buka WA
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Simpan Verifikasi
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
