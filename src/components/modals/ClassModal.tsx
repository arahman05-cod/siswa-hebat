import React, { useState, useEffect } from 'react';
import { X, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
import { ClassData } from '../../types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classToEdit?: ClassData | null;
  onSave: (classData: {
    name: string;
    grade: 'X' | 'XI' | 'XII';
    department: string;
    room: string;
    homeroomTeacherName: string;
    homeroomTeacherNip: string;
  }) => Promise<void>;
}

const STANDARD_DEPARTMENTS = [
  'Farmasi Klinis dan Komunitas',
  'Teknik Laboratorium Medik',
  'Rekayasa Perangkat Lunak (RPL)',
  'Teknik Komputer dan Jaringan (TKJ)',
  'Desain Komunikasi Visual (DKV)',
  'Manajemen Perkantoran dan Layanan Bisnis',
  'Bisnis Digital dan Pemasaran',
  'Teknik Kendaraan Ringan (TKR)',
  'Teknik dan Bisnis Sepeda Motor (TBSM)',
  'Kuliner / Tata Boga',
  'Layanan Kesehatan / Keperawatan',
  'Lainnya (Tulis Sendiri)',
];

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  classToEdit,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [departmentChoice, setDepartmentChoice] = useState('Farmasi Klinis dan Komunitas');
  const [customDepartment, setCustomDepartment] = useState('');
  const [room, setRoom] = useState('');
  const [homeroomTeacherName, setHomeroomTeacherName] = useState('');
  const [homeroomTeacherNip, setHomeroomTeacherNip] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classToEdit) {
      setName(classToEdit.name);
      setGrade(classToEdit.grade);
      if (STANDARD_DEPARTMENTS.includes(classToEdit.department)) {
        setDepartmentChoice(classToEdit.department);
        setCustomDepartment('');
      } else {
        setDepartmentChoice('Lainnya (Tulis Sendiri)');
        setCustomDepartment(classToEdit.department);
      }
      setRoom(classToEdit.room || '');
      setHomeroomTeacherName(classToEdit.homeroomTeacherName || '');
      setHomeroomTeacherNip(classToEdit.homeroomTeacherNip || '');
      setShowAdvanced(Boolean(classToEdit.room || classToEdit.homeroomTeacherName));
    } else {
      setName('');
      setGrade('X');
      setDepartmentChoice('Farmasi Klinis dan Komunitas');
      setCustomDepartment('');
      setRoom('');
      setHomeroomTeacherName('');
      setHomeroomTeacherNip('');
      setShowAdvanced(false);
    }
    setError('');
  }, [classToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kelas/rombel wajib diisi.');
      return;
    }

    const finalDepartment =
      departmentChoice === 'Lainnya (Tulis Sendiri)'
        ? customDepartment.trim()
        : departmentChoice.trim();

    if (!finalDepartment) {
      setError('Program studi wajib diisi atau dipilih.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        grade,
        department: finalDepartment,
        room: room.trim() || 'Ruang Teori',
        homeroomTeacherName: homeroomTeacherName.trim() || 'Belum Ditugaskan',
        homeroomTeacherNip: homeroomTeacherNip.trim() || '-',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data rombel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {classToEdit ? 'Edit Kelas / Rombel' : 'Tambah Kelas Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Kelola nama kelas/rombel, tingkat kelas, dan program studi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* 1. Nama Kelas/Rombel */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Kelas / Rombel *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: X TLM, X Far-A, XI TLM, XII TKJ"
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Format nama rombongan belajar resmi yang terdaftar di sekolah
            </p>
          </div>

          {/* Spreadsheet synchronization note */}
          <div className="rounded-xl bg-teal-50/70 border border-teal-200/80 p-3 text-[11px] text-teal-800">
            <div className="font-bold flex items-center gap-1.5 text-teal-900 mb-1">
              <span>📊 Sinkronisasi Google Spreadsheet (Sheet: Data_Kelas)</span>
            </div>
            <p className="text-teal-700 leading-relaxed">
              Data kelas akan disimpan dengan isian kolom: <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">ID_Kelas</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Nama_Kelas</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Tingkat</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Jurusan</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Tahun_Ajaran</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Wali_Kelas</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Ruangan</code>, <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono text-[10px]">Status_Kesepakatan</code>.
            </p>
          </div>

          {/* 2. Tingkat Kelas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Tingkat Kelas *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['X', 'XI', 'XII'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    grade === g
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Tingkat {g}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Program Study */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Program Studi / Jurusan *
            </label>
            <div className="relative">
              <select
                value={departmentChoice}
                onChange={(e) => setDepartmentChoice(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {STANDARD_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {departmentChoice === 'Lainnya (Tulis Sendiri)' && (
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  placeholder="Ketik nama program studi / konsentrasi keahlian..."
                  className="w-full rounded-xl border border-teal-300 bg-teal-50/30 p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            )}
          </div>

          {/* Collapsible / Optional Details */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{showAdvanced ? '▼ Sembunyikan Detail Tambahan' : '▶ Tampilkan Detail Tambahan (Ruang & Wali Kelas)'}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-3 pt-2 border-t border-slate-100 bg-slate-50/60 p-3 rounded-xl border">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ruang Belajar / Laboratorium
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Contoh: Lab Farmasi Dasar 1 / Ruang Teori 101"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Wali Kelas
                  </label>
                  <input
                    type="text"
                    value={homeroomTeacherName}
                    onChange={(e) => setHomeroomTeacherName(e.target.value)}
                    placeholder="Contoh: Ahmad Rahman, S.Pd."
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Wali Kelas
                  </label>
                  <input
                    type="text"
                    value={homeroomTeacherNip}
                    onChange={(e) => setHomeroomTeacherNip(e.target.value)}
                    placeholder="19840210 200801 1 005"
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-500 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : classToEdit ? 'Simpan Perubahan' : 'Tambah Kelas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
