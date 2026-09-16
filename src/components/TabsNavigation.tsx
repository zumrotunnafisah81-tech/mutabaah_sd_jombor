import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  SunMedium,
  BookOpen,
  TrendingUp,
  Star,
  Printer,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface TabsNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Siswa',
      desc: 'Biodata & Kehadiran',
      icon: LayoutDashboard,
    },
    {
      id: 'checklist_fardu' as ActiveTab,
      label: 'Salat Fardu',
      desc: 'Subuh, Zuhur, Asar, Magrib, Isya',
      icon: CheckSquare,
    },
    {
      id: 'presensi_dhuha' as ActiveTab,
      label: 'Salat Dhuha',
      desc: '2, 4, 8 Rakaat / Sekolah',
      icon: SunMedium,
    },
    {
      id: 'rekap_mengaji' as ActiveTab,
      label: 'Monitoring Mengaji',
      desc: 'Iqro & Al-Qur\'an',
      icon: BookOpen,
    },
    {
      id: 'rekap_mingguan' as ActiveTab,
      label: 'Rekap Mingguan',
      desc: 'Rasio 33/35, 5/7, 6/7',
      icon: TrendingUp,
    },
    {
      id: 'peringkat_bintang' as ActiveTab,
      label: 'Bintang Kebaikan',
      desc: 'Poin & Level Hadiah',
      icon: Star,
    },
    {
      id: 'cetak_mutabaah' as ActiveTab,
      label: 'Cetak Mutaba\'ah',
      desc: 'Format Fisik PDF A4',
      icon: Printer,
    },
  ];

  return (
    <div className="border-b border-slate-200 mb-6 print:hidden">
      <nav
        className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-px scrollbar-thin"
        aria-label="Navigasi Menu Mutabaah"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center py-2.5 px-3 sm:px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'border-emerald-700 text-emerald-900 bg-emerald-50/70 rounded-t-xl font-bold shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon
                className={`w-4 h-4 mr-1.5 transition-colors shrink-0 ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <div className="text-left">
                <div className="leading-tight">{tab.label}</div>
                <div className="text-[10px] text-slate-400 font-normal hidden lg:block">
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
