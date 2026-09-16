import { Student, DailyRecord } from '../types';
import { INITIAL_STUDENTS, generateInitialRecords } from '../data/initialData';

const STUDENTS_KEY = 'mutabaah_students_v1';
const RECORDS_KEY = 'mutabaah_daily_records_v1';

export function loadStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function loadStoredRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
  }
  return generateInitialRecords();
}

export function saveStoredRecords(records: Record<string, DailyRecord>): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
}

export function exportBackupJSON(students: Student[], records: Record<string, DailyRecord>): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    students,
    records,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_mutabaah_siswa_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
