import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  DailyRecord,
  FardhuPrayerKey,
  PrayerStatus,
  Student,
  DhuhaStatus,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_RECORDS,
  getTodayDateString,
  SCHOOL_INFO,
} from './data/initialData';
import { Header } from './components/Header';
import { TabsNavigation } from './components/TabsNavigation';
import { StatsOverview } from './components/StatsOverview';
import { PrayerReminderBanner } from './components/PrayerReminderBanner';
import { StudentDashboardView } from './components/StudentDashboardView';
import { ChecklistFarduView } from './components/ChecklistFarduView';
import { QuickDhuhaMode } from './components/QuickDhuhaMode';
import { MengajiRecapView } from './components/MengajiRecapView';
import { WeeklyRecapView } from './components/WeeklyRecapView';
import { BintangKebaikanView } from './components/BintangKebaikanView';
import { CetakMutabaahView } from './components/CetakMutabaahView';
import { StudentCheckModal } from './components/StudentCheckModal';
import { ParentValidationModal } from './components/ParentValidationModal';
import { ManageStudentsModal } from './components/ManageStudentsModal';
import {
  calculateDailyPoints,
  calculateStudentStats,
  getDefaultPrayerRecord,
} from './utils/helpers';

const STORAGE_KEYS = {
  STUDENTS: 'mutabaah_students_jombor_v1',
  RECORDS: 'mutabaah_records_jombor_v1',
  USER_ROLE: 'mutabaah_user_role_v1',
};

export default function App() {
  // State 1: Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // State 2: Records (keyed by `${studentId}_${date}`)
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error('Error loading records from localStorage', e);
    }
    return INITIAL_RECORDS;
  });

  // State 3: Selected Date & Navigation Tab
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // State 4: User Role (Guru vs Ortu/Siswa)
  const [userRole, setUserRole] = useState<'guru' | 'ortu'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
      if (saved === 'guru' || saved === 'ortu') return saved;
    } catch (e) {}
    return 'guru';
  });

  // Modal States
  const [checkModalStudent, setCheckModalStudent] = useState<Student | null>(null);
  const [parentModalStudent, setParentModalStudent] = useState<Student | null>(null);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to localStorage', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
    } catch (e) {}
  }, [userRole]);

  // Handler: Update prayer status for 1 prayer of 1 student
  const handleUpdatePrayerStatus = (
    studentId: string,
    prayerKey: FardhuPrayerKey,
    newStatus: PrayerStatus
  ) => {
    const key = `${studentId}_${selectedDate}`;
    setRecords((prev) => {
      const existing = prev[key];
      const basePrayers = existing?.prayers || getDefaultPrayerRecord();
      const updatedPrayers = {
        ...basePrayers,
        [prayerKey]: newStatus,
      };

      const pts = calculateDailyPoints(
        updatedPrayers,
        Boolean(existing?.mengaji && existing.mengaji.jilidOrSurah)
      );

      const updatedRecord: DailyRecord = {
        id: key,
        studentId,
        date: selectedDate,
        prayers: updatedPrayers,
        mengaji: existing?.mengaji,
        catatanGuru: existing?.catatanGuru,
        parafGuru: existing?.parafGuru ?? false,
        verifikasiOrtu: existing?.verifikasiOrtu ?? false,
        namaOrtu: existing?.namaOrtu,
        catatanOrtu: existing?.catatanOrtu,
        waktuValidasiOrtu: existing?.waktuValidasiOrtu,
        poinHariIni: pts.totalPoints,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [key]: updatedRecord,
      };
    });
  };

  // Handler: Update Dhuha status for 1 student
  const handleUpdateDhuhaStatus = (
    studentId: string,
    newStatus: DhuhaStatus
  ) => {
    const key = `${studentId}_${selectedDate}`;
    setRecords((prev) => {
      const existing = prev[key];
      const basePrayers = existing?.prayers || getDefaultPrayerRecord();
      const updatedPrayers = {
        ...basePrayers,
        dhuha: newStatus,
      };

      const pts = calculateDailyPoints(
        updatedPrayers,
        Boolean(existing?.mengaji && existing.mengaji.jilidOrSurah)
      );

      const updatedRecord: DailyRecord = {
        id: key,
        studentId,
        date: selectedDate,
        prayers: updatedPrayers,
        mengaji: existing?.mengaji,
        catatanGuru: existing?.catatanGuru,
        parafGuru: existing?.parafGuru ?? false,
        verifikasiOrtu: existing?.verifikasiOrtu ?? false,
        namaOrtu: existing?.namaOrtu,
        catatanOrtu: existing?.catatanOrtu,
        waktuValidasiOrtu: existing?.waktuValidasiOrtu,
        poinHariIni: pts.totalPoints,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [key]: updatedRecord,
      };
    });
  };

  // Handler: Save complete record from StudentCheckModal
  const handleSaveRecord = (record: DailyRecord) => {
    const key = `${record.studentId}_${record.date}`;
    const pts = calculateDailyPoints(
      record.prayers,
      Boolean(record.mengaji && record.mengaji.jilidOrSurah)
    );

    const fullRecord: DailyRecord = {
      ...record,
      poinHariIni: pts.totalPoints,
    };

    setRecords((prev) => ({
      ...prev,
      [key]: fullRecord,
    }));
  };

  // Handler: Save parent validation
  const handleSaveParentValidation = (
    studentId: string,
    namaOrtu: string,
    catatanOrtu?: string
  ) => {
    const key = `${studentId}_${selectedDate}`;
    setRecords((prev) => {
      const existing = prev[key];
      const prayers = existing?.prayers || getDefaultPrayerRecord();
      const pts = calculateDailyPoints(
        prayers,
        Boolean(existing?.mengaji && existing.mengaji.jilidOrSurah)
      );

      const updatedRecord: DailyRecord = {
        id: key,
        studentId,
        date: selectedDate,
        prayers,
        mengaji: existing?.mengaji,
        catatanGuru: existing?.catatanGuru,
        parafGuru: existing?.parafGuru ?? false,
        verifikasiOrtu: true,
        namaOrtu: namaOrtu.trim() || 'Orang Tua / Wali',
        catatanOrtu: catatanOrtu?.trim(),
        waktuValidasiOrtu: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        poinHariIni: pts.totalPoints,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [key]: updatedRecord,
      };
    });
  };

  // Handler: Save updated students list
  const handleSaveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  // Handler: Export JSON Backup
  const handleExportData = () => {
    const exportData = {
      version: '1.0',
      school: SCHOOL_INFO,
      exportDate: new Date().toISOString(),
      students,
      records,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `mutabaah_sdn_jombor_${selectedDate}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* 1. Header (School Branding, Date Picker, Role Switcher) */}
      <Header
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onOpenManageStudents={() => setIsManageStudentsOpen(true)}
        onExportData={handleExportData}
        totalStudents={students.length}
        userRole={userRole}
        onToggleUserRole={setUserRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* 2. Notification / Reminder Banner */}
        <PrayerReminderBanner
          students={students}
          records={records}
          selectedDate={selectedDate}
        />

        {/* 3. Global Stats Overview (Cards: Fardhu, Dhuha, Mengaji, Validasi) */}
        {activeTab !== 'cetak_mutabaah' && (
          <StatsOverview
            students={students}
            records={records}
            selectedDate={selectedDate}
          />
        )}

        {/* 4. Tab Navigation (The 7 requested core modules) */}
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 5. Tab Content Views */}
        {activeTab === 'dashboard' && (
          <StudentDashboardView
            students={students}
            records={records}
            selectedDate={selectedDate}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
            onOpenParentValidation={(std) => setParentModalStudent(std)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'checklist_fardu' && (
          <ChecklistFarduView
            students={students}
            records={records}
            selectedDate={selectedDate}
            onUpdatePrayerStatus={handleUpdatePrayerStatus}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
            onOpenParentValidation={(std) => setParentModalStudent(std)}
          />
        )}

        {activeTab === 'presensi_dhuha' && (
          <QuickDhuhaMode
            students={students}
            records={records}
            selectedDate={selectedDate}
            onUpdateDhuhaStatus={handleUpdateDhuhaStatus}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
          />
        )}

        {activeTab === 'rekap_mengaji' && (
          <MengajiRecapView
            students={students}
            records={records}
            selectedDate={selectedDate}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
          />
        )}

        {activeTab === 'rekap_mingguan' && (
          <WeeklyRecapView
            students={students}
            records={records}
            selectedDate={selectedDate}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
            onOpenParentValidation={(std) => setParentModalStudent(std)}
          />
        )}

        {activeTab === 'peringkat_bintang' && (
          <BintangKebaikanView
            students={students}
            records={records}
            selectedDate={selectedDate}
            onOpenCheckModal={(std) => setCheckModalStudent(std)}
          />
        )}

        {activeTab === 'cetak_mutabaah' && (
          <CetakMutabaahView
            students={students}
            records={records}
            selectedDate={selectedDate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{SCHOOL_INFO.namaSekolah}</strong> • Aplikasi Mutaba'ah Salat Fardu, Salat Dhuha & Mengaji Siswa
          </div>
          <div>
            Guru PAI / Wali Kelas: <span className="font-semibold text-slate-700">{SCHOOL_INFO.guruKelas}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {checkModalStudent && (
        <StudentCheckModal
          isOpen={Boolean(checkModalStudent)}
          onClose={() => setCheckModalStudent(null)}
          student={checkModalStudent}
          selectedDate={selectedDate}
          record={records[`${checkModalStudent.id}_${selectedDate}`]}
          onSaveRecord={handleSaveRecord}
          onOpenParentValidation={(std) => {
            setCheckModalStudent(null);
            setParentModalStudent(std);
          }}
        />
      )}

      {parentModalStudent && (
        <ParentValidationModal
          isOpen={Boolean(parentModalStudent)}
          onClose={() => setParentModalStudent(null)}
          student={parentModalStudent}
          selectedDate={selectedDate}
          record={records[`${parentModalStudent.id}_${selectedDate}`]}
          stats={calculateStudentStats(parentModalStudent.id, records, selectedDate)}
          onSaveValidation={handleSaveParentValidation}
        />
      )}

      {isManageStudentsOpen && (
        <ManageStudentsModal
          isOpen={isManageStudentsOpen}
          onClose={() => setIsManageStudentsOpen(false)}
          students={students}
          onSaveStudents={handleSaveStudents}
        />
      )}

    </div>
  );
}
