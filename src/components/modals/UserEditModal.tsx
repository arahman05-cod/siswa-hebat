import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Edit,
  ShieldCheck,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserProfile | null;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {
  const { classes, addUser, updateUser } = useApp();

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('wali_kelas');
  const [roleLabel, setRoleLabel] = useState('');
  const [email, setEmail] = useState('');
  const [assignedClassIds, setAssignedClassIds] = useState<string[]>([]);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setNip(userToEdit.nip);
      setRole(userToEdit.role);
      setRoleLabel(userToEdit.roleLabel);
      setEmail(userToEdit.email);
      setAssignedClassIds(userToEdit.assignedClassIds || []);
    } else {
      setName('');
      setNip('');
      setRole('wali_kelas');
      setRoleLabel('Wali Kelas');
      setEmail('');
      setAssignedClassIds([classes[0]?.id || 'cls-xi-ak']);
    }
  }, [userToEdit, isOpen, classes]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    switch (newRole) {
      case 'admin':
        setRoleLabel('Administrator Sistem & Data');
        break;
      case 'wali_kelas':
        setRoleLabel('Wali Kelas');
        break;
      case 'guru_bk':
        setRoleLabel('Guru Bimbingan Konseling / Pendamping');
        break;
      case 'kepala_sekolah':
        setRoleLabel('Kepala Sekolah');
        break;
    }
  };

  const handleToggleClass = (classId: string) => {
    setAssignedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Partial<UserProfile> = {
      name: name.trim(),
      nip: nip.trim() || '-',
      role,
      roleLabel: roleLabel.trim() || undefined,
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@smk.belajar.id`,
      assignedClassIds,
    };

    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, payload);
      } else {
        await addUser(payload);
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data pengguna.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              {userToEdit ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {userToEdit ? 'Edit Pengguna & Hak Akses' : 'Tambah Pengguna Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Penetapan identitas pegawai dan batas kewenangan sistem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Nama Lengkap & Gelar */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Lengkap & Gelar Pegawai *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dra. Sri Wahyuni, M.Pd."
              className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* NIP & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP / No. Pegawai *</label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19850615 201001 1 018"
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pos-el (Email Belajar.id) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@guru.smk.belajar.id"
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs"
              />
            </div>
          </div>

          {/* Peran Utama */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Peran Utama & Hak Akses *
            </label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="wali_kelas">Wali Kelas (Akses Rombel Terkait & Kesepakatan)</option>
              <option value="guru_bk">Guru BK / Konselor (Akses Penuh Pendampingan & Kasus)</option>
              <option value="kepala_sekolah">Kepala Sekolah (Akses Laporan & Ringkasan Eksekutif)</option>
              <option value="admin">Administrator (Akses Sistem & Konfigurasi Teknis)</option>
            </select>
          </div>

          {/* Label Peran Kustom */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Keterangan Jabatan / Penugasan Khusus
            </label>
            <input
              type="text"
              value={roleLabel}
              onChange={(e) => setRoleLabel(e.target.value)}
              placeholder="Contoh: Wali Kelas XI PPLG 1 atau Koordinator BK"
              className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs"
            />
          </div>

          {/* Penugasan Kelas Binaan (Untuk Wali Kelas / Guru BK) */}
          {(role === 'wali_kelas' || role === 'guru_bk') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Rombongan Belajar (Kelas) yang Ditugaskan:
              </label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                {classes.map((cls) => {
                  const isChecked = assignedClassIds.includes(cls.id);
                  return (
                    <label
                      key={cls.id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleClass(cls.id)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-semibold">{cls.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            <span>Kerahasiaan data terotorisasi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500"
            >
              {userToEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
