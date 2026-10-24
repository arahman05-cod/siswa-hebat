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
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Copy,
  Download,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserRole } from '../types';
import { UserEditModal } from '../components/modals/UserEditModal';

export const UsersPermissionsPage: React.FC = () => {
  const {
    users,
    currentUser,
    switchUserRole,
    deleteUser,
    classes,
    auditLogs,
    schoolProfile,
    updateSchoolProfile,
    syncUsersToSpreadsheet,
    testSpreadsheetConnection,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Spreadsheet Sync State
  const [isSyncingSpreadsheet, setIsSyncingSpreadsheet] = useState(false);
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
  const [isCopyTableModalOpen, setIsCopyTableModalOpen] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(schoolProfile?.spreadsheetWebhookUrl || '');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const spreadsheetId = schoolProfile?.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M';
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const getUserRowsForSpreadsheet = () => {
    return users.map((u) => {
      const assignedClasses = Array.isArray(u.assignedClassIds) ? u.assignedClassIds : [];
      const classIdStr = assignedClasses.length > 0 ? assignedClasses.join('; ') : '-';

      let cakupanAkses = 'Terbatas';
      if (u.role === 'admin') {
        cakupanAkses = 'Penuh (Administrator Sistem & Basis Data)';
      } else if (u.role === 'kepala_sekolah') {
        cakupanAkses = 'Eksekutif (Seluruh Kelas & Laporan)';
      } else if (u.role === 'guru_bk') {
        cakupanAkses = 'Layanan BK & Kasus Siswa (Seluruh Kelas)';
      } else if (u.role === 'wali_kelas') {
        if (assignedClasses.length > 0) {
          const classNames = assignedClasses.map((cid: string) => {
            const found = classes?.find((c) => c.id === cid);
            return found ? found.name : cid;
          });
          cakupanAkses = `Perwalian: ${classNames.join(', ')}`;
        } else {
          cakupanAkses = 'Wali Kelas (Belum Ada Rombel Ditugaskan)';
        }
      }

      return {
        user_id: u.id,
        nama_lengkap: u.name,
        email: u.email || '-',
        peran: u.roleLabel || u.role,
        class_id: classIdStr,
        aktif: 'Aktif',
        cakupan_akses: cakupanAkses,
        tgl_ditambahkan: new Date().toLocaleDateString('id-ID'),
      };
    });
  };

  const handleSyncUsersSpreadsheet = async () => {
    if (!schoolProfile.spreadsheetWebhookUrl) {
      setTempWebhookUrl('');
      setWebhookTestStatus(null);
      setIsSpreadsheetModalOpen(true);
      return;
    }

    setIsSyncingSpreadsheet(true);
    try {
      const res = await syncUsersToSpreadsheet();
      showFeedback('success', `Berhasil! ${res.count || users.length} akun pengguna berhasil disinkronkan ke Google Spreadsheet (Lembar: Data_Pengguna).`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal sinkronisasi data pengguna ke Spreadsheet. Periksa URL Webhook.');
    } finally {
      setIsSyncingSpreadsheet(false);
    }
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempWebhookUrl.trim()) return;

    setIsTestingWebhook(true);
    setWebhookTestStatus(null);

    try {
      await testSpreadsheetConnection(tempWebhookUrl.trim(), spreadsheetId);
      await updateSchoolProfile({ spreadsheetWebhookUrl: tempWebhookUrl.trim() });
      setWebhookTestStatus({
        success: true,
        message: 'Koneksi Berhasil! Webhook aktif dan tersimpan. Siap sinkronisasi otomatis.',
      });
      showFeedback('success', 'Webhook Google Spreadsheet berhasil dihubungkan!');
    } catch (err: any) {
      setWebhookTestStatus({
        success: false,
        message: err.message || 'Gagal terhubung ke Webhook Apps Script. Pastikan Webhook telah dideploy sebagai Web App (Anyone).',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleCopyTsv = () => {
    const rows = getUserRowsForSpreadsheet();
    const headers = ['user_id', 'nama_lengkap', 'email', 'peran', 'class_id', 'aktif', 'cakupan_akses', 'tgl_ditambahkan'];
    const tsvContent = [
      headers.join('\t'),
      ...rows.map((r) => [
        r.user_id,
        r.nama_lengkap,
        r.email,
        r.peran,
        r.class_id,
        r.aktif,
        r.cakupan_akses,
        r.tgl_ditambahkan,
      ].join('\t')),
    ].join('\n');

    navigator.clipboard.writeText(tsvContent);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 3000);
    showFeedback('success', 'Data tabel pengguna (format TSV) berhasil disalin ke clipboard! Siap di-paste ke Google Spreadsheet.');
  };

  const handleDownloadCsv = () => {
    const rows = getUserRowsForSpreadsheet();
    const headers = ['user_id', 'nama_lengkap', 'email', 'peran', 'class_id', 'aktif', 'cakupan_akses', 'tgl_ditambahkan'];
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => [
        `"${r.user_id}"`,
        `"${r.nama_lengkap.replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${r.peran.replace(/"/g, '""')}"`,
        `"${r.class_id}"`,
        `"${r.aktif}"`,
        `"${r.cakupan_akses.replace(/"/g, '""')}"`,
        `"${r.tgl_ditambahkan}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Pengguna_${schoolProfile.academicYear?.replace('/', '-') || '2026-2027'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('success', 'File CSV Data_Pengguna berhasil diunduh.');
  };

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
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center justify-between shadow-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={`h-4 w-4 shrink-0 ${
                feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer text-slate-500"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manajemen Pengguna & Hak Akses Berbasis Peran
          </h2>
          <p className="text-xs text-slate-500">
            Kelola daftar akun pegawai, penetapan tugas perwalian/konseling, dan sinkronisasi basis data pengguna
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Sync Quick-Bar Card */}
      <div className="rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-teal-50/70 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Sinkronisasi Google Spreadsheet: Lembar Data_Pengguna
                </h3>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-extrabold text-teal-800 uppercase tracking-wider">
                  8 Kolom Tersedia
                </span>
                {schoolProfile?.spreadsheetWebhookUrl ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Webhook Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Webhook Belum Terhubung
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Setiap kali tambah pengguna baru, data otomatis tersimpan ke spreadsheet dengan susunan:
              </p>
              <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono font-semibold text-teal-900">
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">user_id</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">nama_lengkap</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">email</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">peran</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">class_id</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">aktif</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">cakupan_akses</span>
                <span className="bg-white/80 border border-teal-200 px-1.5 py-0.5 rounded">tgl_ditambahkan</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleSyncUsersSpreadsheet}
              disabled={isSyncingSpreadsheet}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                isSyncingSpreadsheet
                  ? 'bg-teal-300 text-teal-900 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-500'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSpreadsheet ? 'animate-spin' : ''}`} />
              <span>{isSyncingSpreadsheet ? 'Menyinkronkan...' : 'Sinkronkan Pengguna'}</span>
            </button>

            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50 transition-all shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
              <span>Buka Spreadsheet</span>
            </a>

            <button
              onClick={() => setIsCopyTableModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer"
              title="Lihat atau Salin Tabel Format Spreadsheet"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>Salin TSV</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer"
              title="Unduh CSV Data_Pengguna"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => {
                setTempWebhookUrl(schoolProfile.spreadsheetWebhookUrl || '');
                setWebhookTestStatus(null);
                setIsSpreadsheetModalOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer"
              title="Konfigurasi Webhook Spreadsheet"
            >
              <Sliders className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
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

      {/* Modal: Konfigurasi Webhook Spreadsheet */}
      {isSpreadsheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Konfigurasi Webhook Spreadsheet (Data_Pengguna)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID Spreadsheet: <span className="font-mono text-teal-700">{spreadsheetId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSpreadsheetModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWebhook} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL Web App Google Apps Script *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={tempWebhookUrl}
                  onChange={(e) => setTempWebhookUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Pastikan Web App dideploy dengan hak akses: <span className="font-semibold text-slate-700">"Who has access: Anyone"</span>.
                </p>
              </div>

              {webhookTestStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium ${
                    webhookTestStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {webhookTestStatus.message}
                </div>
              )}

              <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3 text-[11px] text-teal-900 space-y-1">
                <div className="font-bold">Struktur Lembar Kerja Data_Pengguna (8 Kolom):</div>
                <div className="font-mono text-[10px] text-teal-800 leading-relaxed">
                  user_id | nama_lengkap | email | peran | class_id | aktif | cakupan_akses | tgl_ditambahkan
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSpreadsheetModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isTestingWebhook || !tempWebhookUrl.trim()}
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isTestingWebhook || !tempWebhookUrl.trim()
                      ? 'bg-teal-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-500'
                  }`}
                >
                  {isTestingWebhook ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Menguji Koneksi...</span>
                    </>
                  ) : (
                    <span>Uji & Simpan Webhook</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview / Salin Format Tabel Data_Pengguna */}
      {isCopyTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <Copy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Format Data_Pengguna Google Spreadsheet
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pratinjau struktur 8 kolom sesuai standar untuk lembar kerja <span className="font-semibold text-teal-700">Data_Pengguna</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCopyTableModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">{users.length} Akun Pengguna</span> terformat siap disinkronkan atau disalin.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTsv}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      copiedTsv
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 text-white hover:bg-teal-500'
                    }`}
                  >
                    {copiedTsv ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedTsv ? 'Berhasil Disalin!' : 'Salin Semua Baris (TSV)'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Table preview */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-teal-50 text-teal-950 border-b border-teal-200 font-mono font-bold">
                      <th className="p-2.5 text-left">user_id</th>
                      <th className="p-2.5 text-left">nama_lengkap</th>
                      <th className="p-2.5 text-left">email</th>
                      <th className="p-2.5 text-left">peran</th>
                      <th className="p-2.5 text-left">class_id</th>
                      <th className="p-2.5 text-center">aktif</th>
                      <th className="p-2.5 text-left">cakupan_akses</th>
                      <th className="p-2.5 text-left">tgl_ditambahkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                    {getUserRowsForSpreadsheet().map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/70">
                        <td className="p-2.5 font-bold text-slate-900">{row.user_id}</td>
                        <td className="p-2.5 font-sans font-semibold text-slate-800">{row.nama_lengkap}</td>
                        <td className="p-2.5 text-slate-600">{row.email}</td>
                        <td className="p-2.5 text-teal-800 font-bold">{row.peran}</td>
                        <td className="p-2.5 text-slate-600">{row.class_id}</td>
                        <td className="p-2.5 text-center">
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                            {row.aktif}
                          </span>
                        </td>
                        <td className="p-2.5 font-sans text-slate-600">{row.cakupan_akses}</td>
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">{row.tgl_ditambahkan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsCopyTableModalOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
