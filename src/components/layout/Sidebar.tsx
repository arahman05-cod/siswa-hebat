import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  ScrollText,
  FileSpreadsheet,
  HeartHandshake,
  History,
  CalendarClock,
  FileCheck2,
  ShieldCheck,
  Settings2,
  BookOpen,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, incidentRecords, caseHandlings, classAgreements, logout } =
    useApp();

  const pendingIncidentsCount = incidentRecords.filter(
    (r) => r.status === 'baru' || r.status === 'dalam_tindak_lanjut'
  ).length;

  const ongoingCasesCount = caseHandlings.filter(
    (c) => c.status === 'dalam_penanganan' || c.status === 'menunggu_tindak_lanjut'
  ).length;

  const activeAgreementsCount = classAgreements.filter((a) => a.status === 'aktif').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Ringkasan & agenda pembinaan',
    },
    {
      id: 'data-kelas',
      label: 'Data Kelas',
      icon: GraduationCap,
      badge: null,
      description: 'Daftar rombel & wali kelas',
    },
    {
      id: 'kesepakatan-kelas',
      label: 'Kesepakatan Kelas',
      icon: ScrollText,
      badge: `${activeAgreementsCount} Aktif`,
      badgeColor: 'bg-teal-500/20 text-teal-300',
      description: 'Norma positif & restoratif',
    },
    {
      id: 'catatan-kejadian',
      label: 'Catatan Kejadian',
      icon: FileSpreadsheet,
      badge: pendingIncidentsCount > 0 ? `${pendingIncidentsCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300',
      description: 'Pencatatan faktual tanpa stigma',
    },
    {
      id: 'penanganan-kasus',
      label: 'Penanganan Kasus',
      icon: HeartHandshake,
      badge: ongoingCasesCount > 0 ? `${ongoingCasesCount}` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      description: 'Pendampingan & restitusi',
    },
    {
      id: 'riwayat-pendampingan',
      label: 'Riwayat Pendampingan',
      icon: History,
      badge: null,
      description: 'Linimasa kronologis siswa',
    },
    {
      id: 'rencana-tindak-lanjut',
      label: 'Rencana Tindak Lanjut',
      icon: CalendarClock,
      badge: null,
      description: 'Jadwal evaluasi & konseling',
    },
    {
      id: 'laporan-arsip',
      label: 'Laporan & Arsip',
      icon: FileCheck2,
      badge: 'Cetak A4',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      description: 'Pratinjau dokumen & PDF',
    },
    {
      id: 'pengguna-hak-akses',
      label: 'Pengguna & Hak Akses',
      icon: ShieldCheck,
      badge: null,
      description: 'Otoritas & kontrol kerahasiaan',
    },
    {
      id: 'pengaturan-aplikasi',
      label: 'Pengaturan Aplikasi',
      icon: Settings2,
      badge: null,
      description: 'Profil sekolah & kebijakan data',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md shadow-teal-900/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">Ruang Kelas</span>
                <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Kesepakatan & Pendampingan</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-white border border-teal-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <div className="truncate">
                    <div className="truncate text-sm font-semibold">{item.label}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 text-teal-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Restorative Education Philosophy Badge & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
          <div className="rounded-xl border border-teal-900/40 bg-teal-950/20 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-teal-300 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Budaya Restoratif</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Membangun komitmen kelas tanpa rasa takut, mengedepankan pemulihan hubungan dan
              pertumbuhan martabat siswa.
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-teal-300 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-teal-400" />
            <span>Segarkan Data & Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
