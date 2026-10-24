import {
  Menu,
  RotateCcw,
  UserCheck,
  Building2,
  Calendar,
  Lock,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    switchUserRole,
    users,
    schoolProfile,
    activeTab,
    resetToDefaultData,
    logout,
  } = useApp();

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Ringkasan & Pembinaan';
      case 'data-kelas':
        return 'Data Rombongan Belajar (Kelas)';
      case 'kesepakatan-kelas':
        return 'Modul Kesepakatan & Budaya Positif Kelas';
      case 'catatan-kejadian':
        return 'Jurnal Catatan Kejadian Faktual';
      case 'penanganan-kasus':
        return 'Penanganan & Pendampingan Kasus Restoratif';
      case 'riwayat-pendampingan':
        return 'Riwayat & Linimasa Pendampingan Siswa';
      case 'rencana-tindak-lanjut':
        return 'Agenda & Rencana Tindak Lanjut (RTL)';
      case 'laporan-arsip':
        return 'Pusat Dokumen, Laporan & Cetak PDF';
      case 'pengguna-hak-akses':
        return 'Manajemen Pengguna & Otoritas Akses';
      case 'pengaturan-aplikasi':
        return 'Pengaturan Sistem & Kebijakan Sekolah';
      default:
        return 'Ruang Kelas';
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchUserRole(e.target.value as UserRole);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan seluruh data ke kondisi awal demonstrasi fiktif? Perubahan sementara akan di-reset.'
      )
    ) {
      resetToDefaultData();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 md:h-18 w-full items-center justify-between border-b border-slate-200/90 bg-white/90 px-3 sm:px-4 md:px-6 backdrop-blur-md shadow-2xs transition-all">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 truncate">
              {getPageTitle(activeTab)}
            </h1>
            <span className="hidden items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20 lg:inline-flex">
              <Lock className="h-3 w-3" /> Rahasia & Terlindungi
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 truncate">
            <span className="flex items-center gap-1 font-medium text-slate-700 truncate">
              <Building2 className="h-3 w-3 text-teal-600 shrink-0" />
              <span className="truncate">{schoolProfile.name}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="items-center gap-1 text-slate-500 hidden sm:flex shrink-0">
              <Calendar className="h-3 w-3 text-slate-400" />
              TA {schoolProfile.academicYear} ({schoolProfile.semester})
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Role Simulator & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Reset Demo Data */}
        <button
          onClick={handleResetData}
          title="Reset Data Demonstrasi Fiktif"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset Demo</span>
        </button>

        {/* Role Selector Simulator for Tahap A Testing */}
        <div className="flex items-center gap-1.5 rounded-xl border border-teal-200/90 bg-teal-50/70 p-1 pl-2 sm:pl-2.5 text-xs text-teal-900 shadow-2xs">
          <UserCheck className="h-3.5 w-3.5 text-teal-700 shrink-0 hidden sm:block" />
          <span className="hidden text-[11px] font-semibold text-teal-800 md:inline">Peran:</span>
          <select
            value={currentUser.role}
            onChange={handleRoleChange}
            aria-label="Ganti simulasi peran pengguna"
            className="cursor-pointer bg-transparent py-1 pr-1.5 text-xs font-bold text-teal-950 focus:outline-none"
          >
            {users.map((u) => (
              <option key={u.id} value={u.role}>
                {u.roleLabel.split(' ')[0]} ({u.name.split(',')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-0.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-teal-400 shadow-xs ring-2 ring-teal-500/30">
            {currentUser.avatarInitials}
          </div>
          <div className="hidden 2xl:block text-left">
            <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {currentUser.name.split(',')[0]}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
              {currentUser.roleLabel.split(' ')[0]} {currentUser.roleLabel.split(' ')[1] || ''}
            </div>
          </div>
        </div>

        {/* Reset / Refresh Session Button */}
        <button
          onClick={logout}
          title="Segarkan sesi aplikasi ke status aktif utama"
          className="flex h-9 w-9 sm:h-auto sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 sm:px-3 sm:py-2 text-xs font-bold text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-teal-600" />
          <span className="hidden sm:inline">Segarkan Sesi</span>
        </button>
      </div>
    </header>
  );
};
