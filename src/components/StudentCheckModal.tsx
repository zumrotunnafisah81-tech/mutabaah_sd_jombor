import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Calendar,
  BookOpen,
  Sun,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  DailyRecord,
  DailyStudentPrayer,
  DhuhaStatus,
  FardhuPrayerKey,
  KelancaranLevel,
  MengajiEntry,
  MengajiType,
  PrayerStatus,
  Student,
} from '../types';
import {
  DHUHA_STATUS_CONFIG,
  formatIndonesianDate,
  getDefaultPrayerRecord,
  KELANCARAN_CONFIG,
  PRAYER_NAMES,
  PRAYER_STATUS_CONFIG,
  generateWhatsAppReport,
} from '../utils/helpers';

interface StudentCheckModalProps {
  student: Student | null;
  date: string;
  record?: DailyRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: DailyRecord) => void;
}

export const StudentCheckModal: React.FC<StudentCheckModalProps> = ({
  student,
  date,
  record,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !student) return null;

  const [prayers, setPrayers] = useState<DailyStudentPrayer>(getDefaultPrayerRecord());
  const [hasMengaji, setHasMengaji] = useState<boolean>(false);
  const [mengaji, setMengaji] = useState<MengajiEntry>({
    type: 'iqro',
    jilidOrSurah: '',
    halamanOrAyat: '',
    kelancaran: 'jayyid',
    catatan: '',
  });
  const [catatanGuru, setCatatanGuru] = useState<string>('');
  const [parafGuru, setParafGuru] = useState<boolean>(true);
  const [showWaPreview, setShowWaPreview] = useState<boolean>(false);
  const [copiedWa, setCopiedWa] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      setPrayers(record.prayers || getDefaultPrayerRecord());
      if (record.mengaji && record.mengaji.jilidOrSurah) {
        setHasMengaji(true);
        setMengaji(record.mengaji);
      } else {
        setHasMengaji(false);
        setMengaji({
          type: student.currentIqroOrSurah?.toLowerCase().includes('qur') ? 'quran' : 'iqro',
          jilidOrSurah: student.currentIqroOrSurah || 'Iqro Jilid 1',
          halamanOrAyat: '',
          kelancaran: 'lancar',
          catatan: '',
        });
      }
      setCatatanGuru(record.catatanGuru || '');
      setParafGuru(record.parafGuru ?? true);
    } else {
      setPrayers(getDefaultPrayerRecord());
      setHasMengaji(false);
      setMengaji({
        type: student.currentIqroOrSurah?.toLowerCase().includes('qur') ? 'quran' : 'iqro',
        jilidOrSurah: student.currentIqroOrSurah || 'Iqro Jilid 1',
        halamanOrAyat: '',
        kelancaran: 'lancar',
        catatan: '',
      });
      setCatatanGuru('');
      setParafGuru(true);
    }
    setShowWaPreview(false);
    setCopiedWa(false);
  }, [student, record, date]);

  const handlePrayerChange = (prayer: FardhuPrayerKey, status: PrayerStatus) => {
    setPrayers((prev) => ({
      ...prev,
      [prayer]: status,
    }));
  };

  const handleDhuhaChange = (status: DhuhaStatus) => {
    setPrayers((prev) => ({
      ...prev,
      dhuha: status,
    }));
  };

  // Quick action: Set all 5 fardhu prayers to berjamaah
  const setAllFardhu = (status: PrayerStatus) => {
    setPrayers((prev) => ({
      ...prev,
      subuh: status,
      dzuhur: status,
      ashar: status,
      maghrib: status,
      isya: status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: DailyRecord = {
      id: `${student.id}_${date}`,
      studentId: student.id,
      date,
      prayers,
      mengaji: hasMengaji ? mengaji : undefined,
      catatanGuru,
      parafGuru,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedRecord);
    onClose();
  };

  const fardhuList: FardhuPrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  const tempRecordForWa: DailyRecord = {
    id: `${student.id}_${date}`,
    studentId: student.id,
    date,
    prayers,
    mengaji: hasMengaji ? mengaji : undefined,
    catatanGuru,
    parafGuru,
    updatedAt: new Date().toISOString(),
  };
  const waText = generateWhatsAppReport(student, date, tempRecordForWa);

  const handleCopyWa = () => {
    navigator.clipboard.writeText(waText);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const phone = student.noHpOrtu?.replace(/\D/g, '') || '';
    const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-emerald-700 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-800 text-emerald-100 font-semibold px-2 py-0.5 rounded">
                Kelas {student.kelas}
              </span>
              <span className="text-xs text-emerald-200">NIS: {student.nis}</span>
            </div>
            <h2 className="text-lg font-bold mt-0.5 tracking-tight">{student.nama}</h2>
            <div className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatIndonesianDate(date)}</span>
            </div>
          </div>
          <button
            id="btn-close-check-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-600 transition text-emerald-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Section 1: Sholat Fardhu 5 Waktu */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Cek Sholat Fardhu 5 Waktu
                </h3>
              </div>
              
              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden sm:inline">Setel Cepat:</span>
                <button
                  type="button"
                  onClick={() => setAllFardhu('berjamaah')}
                  className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium"
                >
                  Semua Jamaah
                </button>
                <button
                  type="button"
                  onClick={() => setAllFardhu('munfarid')}
                  className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 font-medium"
                >
                  Semua Sendiri
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {fardhuList.map((prayerKey) => {
                const currentStatus = prayers[prayerKey];
                return (
                  <div
                    key={prayerKey}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="w-24">
                        <span className="text-sm font-bold text-slate-800">
                          {PRAYER_NAMES[prayerKey]}
                        </span>
                      </div>

                      {/* Pill options */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 flex-1 justify-start sm:justify-end">
                        {(['berjamaah', 'munfarid', 'terlambat', 'tidak'] as PrayerStatus[]).map(
                          (st) => {
                            const isSelected = currentStatus === st;
                            const cfg = PRAYER_STATUS_CONFIG[st];
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handlePrayerChange(prayerKey, st)}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                  isSelected
                                    ? `${cfg.bg} ${cfg.border} border-2 shadow-2xs scale-[1.02]`
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {cfg.label}
                              </button>
                            );
                          }
                        )}

                        {/* Udzur Syar'i (khusus siswi jika sedang haid) */}
                        {student.gender === 'P' && (
                          <button
                            type="button"
                            onClick={() => handlePrayerChange(prayerKey, 'udzur')}
                            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'udzur'
                                ? 'bg-purple-100 text-purple-800 border-2 border-purple-300 scale-[1.02]'
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Udzur
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Sholat Sunnah Dhuha */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Sholat Dhuha Siswa
                </h3>
              </div>
            </div>

            <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/80">
              <p className="text-xs text-amber-900/80 mb-2.5">
                Pilih pelaksanaan sholat dhuha siswa baik di sekolah maupun mandiri di rumah:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  ['berjamaah_sekolah', '8_rakaat', '4_rakaat', '2_rakaat', 'tidak'] as DhuhaStatus[]
                ).map((status) => {
                  const isSelected = prayers.dhuha === status;
                  const cfg = DHUHA_STATUS_CONFIG[status];
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleDhuhaChange(status)}
                      className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                        isSelected
                          ? `${cfg.bg} border-amber-400 ring-2 ring-amber-300/40 shadow-xs font-bold`
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50'
                      }`}
                    >
                      {status === 'berjamaah_sekolah' && '🏫 '}
                      {status === '8_rakaat' && '🌟 '}
                      {status === '4_rakaat' && '☀️ '}
                      {status === '2_rakaat' && '🌤️ '}
                      {status === 'tidak' && '⚪ '}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Mengaji (Iqro / Al-Qur'an) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Pencatatan Mengaji Siswa
                  </h3>
                </div>
              </div>

              {/* Toggle Has Mengaji */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMengaji}
                  onChange={(e) => setHasMengaji(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  {hasMengaji ? 'Ada Setoran Hari Ini' : 'Tidak Ada Setoran'}
                </span>
              </label>
            </div>

            {hasMengaji ? (
              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200/80 space-y-3">
                {/* Jenis Pembelajaran */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kategori / Kitab Mengaji:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'iqro', label: 'Iqro\' (Jilid 1-6)' },
                      { id: 'quran', label: 'Al-Qur\'an 30 Juz' },
                      { id: 'juz_amma', label: 'Juz \'Amma (Juz 30)' },
                      { id: 'yanbua', label: 'Yanbu\'a / Ummi' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setMengaji((prev) => ({
                            ...prev,
                            type: item.id as MengajiType,
                          }))
                        }
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition ${
                          mengaji.type === item.id
                            ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jilid / Surah & Halaman / Ayat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jilid / Nama Surah:
                    </label>
                    <input
                      type="text"
                      value={mengaji.jilidOrSurah}
                      onChange={(e) =>
                        setMengaji((prev) => ({ ...prev, jilidOrSurah: e.target.value }))
                      }
                      placeholder={
                        mengaji.type === 'iqro'
                          ? 'Contoh: Iqro Jilid 4'
                          : 'Contoh: QS. Al-Baqarah'
                      }
                      className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Halaman / Ayat Terakhir:
                    </label>
                    <input
                      type="text"
                      value={mengaji.halamanOrAyat}
                      onChange={(e) =>
                        setMengaji((prev) => ({ ...prev, halamanOrAyat: e.target.value }))
                      }
                      placeholder="Contoh: Halaman 15 atau Ayat 1-20"
                      className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Tingkat Kelancaran & Tajwid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Evaluasi Kelancaran & Tajwid:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        'lancar',
                        'mumtaz',
                        'cukup',
                        'perlu_bimbingan',
                      ] as KelancaranLevel[]
                    ).map((lvl) => {
                      const cfg = KELANCARAN_CONFIG[lvl];
                      const isSelected = mengaji.kelancaran === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            setMengaji((prev) => ({ ...prev, kelancaran: lvl }))
                          }
                          className={`p-2.5 rounded-lg text-left border transition text-xs ${
                            isSelected
                              ? `${cfg.badge} border-2 font-bold shadow-2xs`
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-semibold">{cfg.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            {cfg.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Catatan Mengaji */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Makhraj / Tajwid Khusus:
                  </label>
                  <input
                    type="text"
                    value={mengaji.catatan || ''}
                    onChange={(e) =>
                      setMengaji((prev) => ({ ...prev, catatan: e.target.value }))
                    }
                    placeholder="Contoh: Hati-hati huruf 'Ain dan Ghain, panjang mad thobi'i sudah pas."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  Belum ada setoran mengaji untuk siswa ini hari ini. Centang "Ada Setoran Hari Ini" di atas untuk mencatat.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Catatan Guru & Paraf */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Catatan / Motivasi Guru untuk Siswa & Wali Murid
              </label>
            </div>
            <textarea
              rows={2}
              value={catatanGuru}
              onChange={(e) => setCatatanGuru(e.target.value)}
              placeholder="Contoh: Masya Allah, ananda sangat disiplin sholat dan tartil dalam membaca Al-Qur'an. Pertahankan!"
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between mt-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parafGuru}
                  onChange={(e) => setParafGuru(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Sudah Diperiksa & Diparaf oleh Guru
                </span>
              </label>

              {/* Toggle WhatsApp Preview */}
              <button
                type="button"
                onClick={() => setShowWaPreview(!showWaPreview)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                {showWaPreview ? 'Tutup Preview WA' : 'Lihat Format WA Ortu'}
              </button>
            </div>

            {/* WhatsApp Text Preview Box */}
            {showWaPreview && (
              <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span>Pratinjau Pesan WhatsApp Wali Murid:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyWa}
                      className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-300 font-medium transition"
                    >
                      {copiedWa ? '✓ Tersalin!' : 'Salin Teks'}
                    </button>
                    {student.noHpOrtu && (
                      <button
                        type="button"
                        onClick={handleOpenWhatsApp}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Buka WA
                      </button>
                    )}
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px] bg-white p-2.5 rounded-lg border border-emerald-100 text-slate-700 max-h-40 overflow-y-auto">
                  {waText}
                </pre>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              id="btn-save-check-record"
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan Data Mutaba'ah
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
