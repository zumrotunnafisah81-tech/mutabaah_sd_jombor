import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Trash2,
  Edit2,
  Users,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialData';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveStudents: (newStudents: Student[]) => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  students,
  onSaveStudents,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nama, setNama] = useState('');
  const [absen, setAbsen] = useState<number>(students.length + 1);
  const [nis, setNis] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [kelas, setKelas] = useState('4-A');
  const [currentIqroOrSurah, setCurrentIqroOrSurah] = useState('Iqro Jilid 3');
  const [noHpOrtu, setNoHpOrtu] = useState('08123456789');

  if (!isOpen) return null;

  const resetForm = () => {
    setNama('');
    setAbsen(students.length + 1);
    setNis('');
    setGender('L');
    setKelas('4-A');
    setCurrentIqroOrSurah('Iqro Jilid 3');
    setNoHpOrtu('08123456789');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (std: Student) => {
    setEditingId(std.id);
    setNama(std.nama);
    setAbsen(std.absen);
    setNis(std.nis);
    setGender(std.gender);
    setKelas(std.kelas);
    setCurrentIqroOrSurah(std.currentIqroOrSurah || 'Iqro Jilid 1');
    setNoHpOrtu(std.noHpOrtu || '');
    setIsAdding(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    if (editingId) {
      const updated = students.map((s) =>
        s.id === editingId
          ? {
              ...s,
              nama: nama.trim(),
              absen: Number(absen) || 1,
              nis: nis.trim() || s.nis,
              gender,
              kelas,
              currentIqroOrSurah,
              noHpOrtu,
            }
          : s
      );
      // Sort by absen
      updated.sort((a, b) => a.absen - b.absen);
      onSaveStudents(updated);
    } else {
      const newStudent: Student = {
        id: `std_${Date.now()}`,
        nama: nama.trim(),
        absen: Number(absen) || students.length + 1,
        nis: nis.trim() || `2024${Math.floor(1000 + Math.random() * 9000)}`,
        gender,
        kelas,
        currentIqroOrSurah,
        noHpOrtu,
      };
      const updated = [...students, newStudent];
      updated.sort((a, b) => a.absen - b.absen);
      onSaveStudents(updated);
    }

    resetForm();
  };

  const handleDeleteStudent = (id: string) => {
    if (students.length <= 1) {
      alert('Minimal harus ada 1 siswa di dalam daftar.');
      return;
    }
    if (confirm('Yakin ingin menghapus data siswa ini?')) {
      const updated = students.filter((s) => s.id !== id);
      onSaveStudents(updated);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan ke data awal siswa SD Negeri Jombor?')) {
      onSaveStudents(INITIAL_STUDENTS);
      resetForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kelola Data Siswa SD Negeri Jombor
              </h2>
              <p className="text-xs text-slate-500">
                Daftar kelas {students[0]?.kelas || '4-A'} ({students.length} Siswa Terdaftar)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Top Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAdding(!isAdding);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAdding ? 'Tutup Form Input' : '+ Tambah Siswa Baru'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Awal</span>
            </button>
          </div>

          {/* Form Add / Edit */}
          {isAdding && (
            <form
              onSubmit={handleSaveStudent}
              className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3"
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                {editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzan"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">No Absen *</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={absen}
                    onChange={(e) => setAbsen(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIS Siswa</label>
                  <input
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="202401"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target / Capaian Mengaji</label>
                  <input
                    type="text"
                    value={currentIqroOrSurah}
                    onChange={(e) => setCurrentIqroOrSurah(e.target.value)}
                    placeholder="Iqro Jilid 4 / Juz Amma"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    No. WhatsApp Orang Tua (Untuk Laporan Otomatis)
                  </label>
                  <input
                    type="tel"
                    value={noHpOrtu}
                    onChange={(e) => setNoHpOrtu(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          )}

          {/* Student List Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">Absen</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Target Mengaji</th>
                  <th className="py-2.5 px-3">No HP Ortu</th>
                  <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                      {std.absen}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {std.nama}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{std.nis}</td>
                    <td className="py-2.5 px-3 text-slate-600">{std.currentIqroOrSurah || 'Iqro'}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {std.noHpOrtu || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(std)}
                          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(std.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
