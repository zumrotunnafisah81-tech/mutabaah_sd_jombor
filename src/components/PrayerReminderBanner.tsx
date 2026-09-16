import React, { useState } from 'react';
import { Bell, Clock, Sun, BookOpen, Moon, Check, X } from 'lucide-react';

export const PrayerReminderBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  // Time-based reminder recommendation
  const now = new Date();
  const hours = now.getHours();

  let reminderType = 'dhuha';
  let title = 'Pengingat Salat Dhuha Pagi';
  let message = 'Sudahkah ananda melaksanakan salat Dhuha 2 atau 4 rakaat di mushola sekolah / rumah pagi ini?';
  let icon = Sun;
  let color = 'bg-amber-50 border-amber-200 text-amber-900';
  let iconColor = 'text-amber-600 bg-amber-100';

  if (hours >= 4 && hours < 8) {
    reminderType = 'subuh';
    title = 'Pengingat Salat Subuh & Doa Pagi';
    message = 'Awali hari dengan salat Subuh tepat waktu dan zikir pagi sebelum berangkat ke SD Negeri Jombor.';
    icon = Clock;
    color = 'bg-emerald-50 border-emerald-200 text-emerald-900';
    iconColor = 'text-emerald-600 bg-emerald-100';
  } else if (hours >= 8 && hours < 12) {
    reminderType = 'dhuha';
    title = 'Jadwal Salat Dhuha Bersama di Sekolah';
    message = 'Ayo istirahat sejenak untuk menunaikan salat Dhuha (2, 4, atau 8 rakaat) di Mushola SD Negeri Jombor.';
    icon = Sun;
    color = 'bg-amber-50 border-amber-200 text-amber-900';
    iconColor = 'text-amber-600 bg-amber-100';
  } else if (hours >= 12 && hours < 15) {
    reminderType = 'zuhur';
    title = 'Waktu Salat Zuhur Berjamaah';
    message = 'Mari tegakkan salat Zuhur 4 rakaat berjamaah tepat waktu.';
    icon = Clock;
    color = 'bg-sky-50 border-sky-200 text-sky-900';
    iconColor = 'text-sky-600 bg-sky-100';
  } else if (hours >= 15 && hours < 18) {
    reminderType = 'mengaji';
    title = 'Waktu Sore: Saatnya Mengaji & Muroja\'ah';
    message = 'Waktu sore hari yang berkah untuk mengaji Iqro\' / Al-Qur\'an dan menambah hafalan surah pendek.';
    icon = BookOpen;
    color = 'bg-teal-50 border-teal-200 text-teal-900';
    iconColor = 'text-teal-600 bg-teal-100';
  } else {
    reminderType = 'malam';
    title = 'Evaluasi Mutaba\'ah Malam & Verifikasi Orang Tua';
    message = 'Pastikan salat Magrib & Isya sudah dicentang. Mohon Ayah/Bunda menekan tombol "Verifikasi" buku mutaba\'ah ananda.';
    icon = Moon;
    color = 'bg-indigo-50 border-indigo-200 text-indigo-900';
    iconColor = 'text-indigo-600 bg-indigo-100';
  }

  if (dismissed) return null;

  const IconComponent = icon;

  return (
    <div
      className={`border rounded-xl p-3 sm:p-4 mb-5 flex items-start justify-between gap-3 shadow-2xs transition-all ${color} print:hidden`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              Notifikasi Pengingat Ibadah
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 font-semibold border border-current">
              Aktif
            </span>
          </div>
          <h4 className="text-sm font-bold mt-0.5">{title}</h4>
          <p className="text-xs mt-0.5 opacity-90 max-w-2xl">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-800 transition"
        title="Tutup pengingat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
