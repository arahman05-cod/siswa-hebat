import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X as CloseIcon,
  Users,
  Building,
  Mail,
  UserCog,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserRole } from '../types';
import { UserEditModal } from '../components/modals/UserEditModal';

export const UsersPermissionsPage: React.FC = () => {
  const { users, currentUser, switchUserRole, deleteUser, classes, auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.roleLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      alert('Anda sedang aktif menggunakan akun ini. Beralihlah ke akun lain terlebih dahulu jika ingin menghapusnya.');
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus akun pengguna "${user.name}" (${user.roleLabel})? Tindakan ini akan dicatat di log audit sistem.`
      )
    ) {
      deleteUser(user.id);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          cls: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'wali_kelas':
        return {
          label: 'Wali Kelas',
          cls: 'bg-teal-100 text-teal-800 border-teal-200',
        };
      case 'guru_bk':
        return {
          label: 'Guru BK / Konselor',
          cls: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
      case 'kepala_sekolah':
        return {
          label: 'Kepala Sekolah',
          cls: 'bg-amber-100 text-amber-800 border-amber-200',
        };
    }
  };

  const permissionsMatrix = [
    {
      feature: 'Melihat & Membuat Kesepakatan Kelas',
      admin: true,
      wali_kelas: true,
      guru_bk: true,
      kepala_sekolah: true,
      description: 'Menyusun dan menyepakati aturan positif kelas',
    },
    {
      feature: 'Mencatat Kejadian Faktual di Kelas',
      admin: true,
      wali_kelas: true,
      guru_bk: true,
      kepala_sekolah: false,
      description: 'Pencatatan objektif tanpa label penghakiman',
    },
    {
      feature: 'Mengakses Berkas Kasus Rahasia BK',
      admin: false,
      wali_kelas: false,
      guru_bk: true,
      kepala_sekolah: true,
      description: 'Hanya petugas konselor pembimbing & pimpinan',
    },
    {
      feature: 'Memperbarui Catatan Sesi & Konfirmasi Status Kasus',
      admin: false,
      wali_kelas: false,
      guru_bk: true,
      kepala_sekolah: false,
      description: 'Wewenang profesional penanganan kasus',
    },
    {
      feature: 'Mencetak Laporan Ringkasan Eksekutif',
      admin: true,
      wali_kelas: true,
      guru_bk: true,
      kepala_sekolah: true,
      description: 'Rekapitulasi berkala tanpa membocorkan privasi individu',
    },
    {
      feature: 'Melihat Jejak Audit Keamanan Sistem',
      admin: true,
      wali_kelas: false,
      guru_bk: false,
      kepala_sekolah: true,
      description: 'Log akses dan perubahan berkas sensitif',
    },
    {
      feature: 'Mengubah Profil Sekolah & Kebijakan Retensi',
      admin: true,
      wali_kelas: false,
      guru_bk: false,
      kepala_sekolah: false,
      description: 'Konfigurasi teknis dan sistem',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manajemen Pengguna & Hak Akses Berbasis Peran
          </h2>
          <p className="text-xs text-slate-500">
            Kelola daftar akun pegawai, penetapan tugas perwalian/konseling, dan pembatasan otorisasi
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* User Management Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Daftar Pengguna Aplikasi ({users.length} Akun Terdaftar)
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, NIP, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-52 rounded-xl border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="wali_kelas">Wali Kelas</option>
              <option value="guru_bk">Guru BK</option>
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                <th className="p-3 text-left font-bold">Pegawai / Pengguna</th>
                <th className="p-3 text-left font-bold">Peran & Kewenangan</th>
                <th className="p-3 text-left font-bold">Email Dinas</th>
                <th className="p-3 text-left font-bold">Kelas Binaan</th>
                <th className="p-3 text-center font-bold">Status Sesi</th>
                <th className="p-3 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada data pengguna yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const badge = getRoleBadge(user.role);
                  const isCurrent = currentUser.id === user.id;

                  // Get assigned class names
                  const assignedClasses = (user.assignedClassIds || [])
                    .map((id) => classes.find((c) => c.id === id)?.name)
                    .filter(Boolean);

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isCurrent ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      {/* Name & NIP */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-teal-400 shrink-0">
                            {user.avatarInitials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="rounded bg-teal-100 px-1.5 py-0.2 text-[9px] font-extrabold text-teal-800 uppercase">
                                  Aktif Saat Ini
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              NIP. {user.nip}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold border ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{user.roleLabel}</div>
                      </td>

                      {/* Email */}
                      <td className="p-3">
                        <span className="text-slate-600 font-mono text-[11px]">{user.email}</span>
                      </td>

                      {/* Classes */}
                      <td className="p-3">
                        {assignedClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedClasses.map((cName, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700"
                              >
                                {cName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Semua / Terbuka</span>
                        )}
                      </td>

                      {/* Session Status / Switch */}
                      <td className="p-3 text-center">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700">
                            <Check className="h-3.5 w-3.5" /> Sedang Masuk
                          </span>
                        ) : (
                          <button
                            onClick={() => switchUserRole(user.role)}
                            title="Gunakan akun ini untuk simulasi pengujian"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-colors"
                          >
                            Uji Akun Ini
                          </button>
                        )}
                      </td>

                      {/* Action Menu (Edit & Hapus) */}
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            title="Edit data pengguna & wewenang"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Hapus pengguna dari sistem"
                            disabled={isCurrent}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                              isCurrent
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Matriks Otorisasi & Pembatasan Kewenangan
          </h3>
          <p className="text-xs text-slate-500">
            Setiap tindakan verifikasi dibatasi secara ketat demi menjaga martabat dan privasi anak.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 text-left font-bold">Fitur & Wewenang</th>
                <th className="p-3 text-center font-bold">Admin</th>
                <th className="p-3 text-center font-bold">Wali Kelas</th>
                <th className="p-3 text-center font-bold">Guru BK</th>
                <th className="p-3 text-center font-bold">Kepala Sekolah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{item.feature}</div>
                    <div className="text-[11px] text-slate-400">{item.description}</div>
                  </td>
                  <td className="p-3 text-center">
                    {item.admin ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <CloseIcon className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {item.wali_kelas ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <CloseIcon className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {item.guru_bk ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <CloseIcon className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {item.kepala_sekolah ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <CloseIcon className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table (Privacy-Preserved) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Jejak Audit Keamanan Sistem (Audit Log)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap aktivitas pendaftaran pengguna, perubahan status, dan pencatatan tersimpan tanpa membeberkan narasi sensitif kasus.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            {auditLogs.length} Catatan Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 text-left font-bold">Waktu</th>
                <th className="p-2.5 text-left font-bold">Pengguna</th>
                <th className="p-2.5 text-left font-bold">Tindakan</th>
                <th className="p-2.5 text-left font-bold">Tipe Berkas</th>
                <th className="p-2.5 text-left font-bold">Ringkasan Non-Sensitif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-2.5 font-semibold text-slate-800">
                    {log.userName.split(',')[0]}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="rounded bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-600">{log.resourceType}</td>
                  <td className="p-2.5 text-slate-600">{log.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit User */}
      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={editingUser}
      />
    </div>
  );
};
