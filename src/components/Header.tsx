import React from 'react';
import {
  Calendar,
  Users,
  Download,
  Plus,
  School,
  CheckCircle2,
  Bell,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { getTodayDateString, getYesterdayDateString, SCHOOL_INFO } from '../data/initialData';
import { formatIndonesianDate } from '../utils/helpers';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenManageStudents: () => void;
  onExportData: () => void;
  totalStudents: number;
  userRole: 'guru' | 'ortu';
  onToggleUserRole: (role: 'guru' | 'ortu') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  onOpenManageStudents,
  onExportData,
  totalStudents,
  userRole,
  onToggleUserRole,
}) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Buku Mutaba'ah Siswa
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {SCHOOL_INFO.namaSekolah}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Wali Kelas: <span className="font-semibold text-slate-700">{SCHOOL_INFO.guruKelas}</span> • {SCHOOL_INFO.kelasDefault}
              </p>
            </div>
          </div>

          {/* Date Picker & Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Mode Switcher: Guru vs Ortu */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => onToggleUserRole('guru')}
                className={`px-2.5 py-1 rounded-md transition ${
                  userRole === 'guru'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mode Guru
              </button>
              <button
                type="button"
                onClick={() => onToggleUserRole('ortu')}
                className={`px-2.5 py-1 rounded-md transition ${
                  userRole === 'ortu'
                    ? 'bg-white text-indigo-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mode Ortu / Siswa
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
              <Calendar className="w-4 h-4 text-slate-500 ml-1.5 mr-1 shrink-0" />
              <input
                id="filter-date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none pr-1 py-1 cursor-pointer"
              />
              <div className="flex items-center border-l border-slate-200 pl-1 space-x-1">
                <button
                  id="btn-quick-today"
                  type="button"
                  onClick={() => onDateChange(today)}
                  className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                    selectedDate === today
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  id="btn-quick-yesterday"
                  type="button"
                  onClick={() => onDateChange(yesterday)}
                  className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                    selectedDate === yesterday
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kemarin
                </button>
              </div>
            </div>

            {/* Data Siswa Modal Trigger */}
            <button
              id="btn-manage-students"
              type="button"
              onClick={onOpenManageStudents}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              title="Kelola Data Siswa"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Siswa ({totalStudents})</span>
            </button>

            {/* Backup Export */}
            <button
              id="btn-export-backup"
              type="button"
              onClick={onExportData}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
              title="Unduh Cadangan Data JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
