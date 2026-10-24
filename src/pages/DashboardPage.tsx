import React, { useState } from 'react';
import {
  ScrollText,
  FileSpreadsheet,
  HeartHandshake,
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfidentialityBanner } from '../components/layout/ConfidentialityBanner';

interface DashboardPageProps {
  onOpenNewAgreement: () => void;
  onOpenNewIncident: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenNewAgreement,
  onOpenNewIncident,
}) => {
  const {
    classes,
    classAgreements,
    incidentRecords,
    caseHandlings,
    followUpPlans,
    currentUser,
    setActiveTab,
    schoolProfile,
    auditLogs,
  } = useApp();

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Filter calculations based on current user role and selected filter
  const filteredAgreements = classAgreements.filter((a) =>
    selectedClassFilter === 'all' ? true : a.classId === selectedClassFilter
  );

  const filteredIncidents = incidentRecords.filter((i) =>
    selectedClassFilter === 'all' ? true : i.classId === selectedClassFilter
  );

  const filteredCases = caseHandlings.filter((c) =>
    selectedClassFilter === 'all' ? true : c.classId === selectedClassFilter
  );

  const activeAgreementsCount = filteredAgreements.filter((a) => a.status === 'aktif').length;
  const pendingIncidentsCount = filteredIncidents.filter(
    (i) => i.status === 'baru' || i.status === 'dalam_tindak_lanjut'
  ).length;
  const activeCasesCount = filteredCases.filter(
    (c) => c.status === 'dalam_penanganan' || c.status === 'menunggu_tindak_lanjut'
  ).length;
  const resolvedCasesCount = filteredCases.filter((c) => c.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Privacy and Non-Punitive Banner */}
      <ConfidentialityBanner />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-teal-500/20 px-2.5 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Portal Terbimbing • Budaya Positif Sekolah</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Selamat datang, {currentUser.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Anda masuk dengan hak akses <span className="font-semibold text-teal-300">{currentUser.roleLabel}</span>.
              Sistem memfasilitasi penegakan kesepakatan kelas secara partisipatif dan pendampingan siswa
              berprinsip restitusi tanpa menghakimi.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewIncident}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-teal-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Kejadian Faktual</span>
            </button>
            <button
              onClick={onOpenNewAgreement}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Kesepakatan Baru</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle decorative shape */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>Filter Tampilan Kelas:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">Semua Rombongan Belajar ({classes.length} Kelas)</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} • {cls.department}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Tahun Ajaran:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {schoolProfile.academicYear} ({schoolProfile.semester})
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Agreements */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kesepakatan Aktif
            </span>
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600">
              <ScrollText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeAgreementsCount}</span>
            <span className="text-xs text-slate-500">/ {classes.length} Rombel</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {activeAgreementsCount === classes.length
              ? 'Seluruh kelas telah menyepakati aturan positif'
              : `${classes.length - activeAgreementsCount} kelas belum memiliki kesepakatan aktif`}
          </p>
          <button
            onClick={() => setActiveTab('kesepakatan-kelas')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
          >
            Lihat daftar kesepakatan <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 2: Pending Incidents */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kejadian Butuh Tindak Lanjut
            </span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingIncidentsCount}</span>
            <span className="text-xs text-amber-700 font-medium">catatan faktual</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Perlu konfirmasi dialog restoratif di kelas atau rujukan BK
          </p>
          <button
            onClick={() => setActiveTab('catatan-kejadian')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            Buka jurnal kejadian <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 3: Active Restorative Cases */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dalam Pendampingan
            </span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <HeartHandshake className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeCasesCount}</span>
            <span className="text-xs text-slate-500">kasus siswa</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Proses pendampingan konseling & pemulihan target
          </p>
          <button
            onClick={() => setActiveTab('penanganan-kasus')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Kelola pendampingan <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 4: Upcoming RTL Agenda */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Agenda Evaluasi Pekan Ini
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{followUpPlans.length}</span>
            <span className="text-xs text-emerald-700 font-medium">terjadwal</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {resolvedCasesCount} kasus telah tuntas diselesaikan dengan baik
          </p>
          <button
            onClick={() => setActiveTab('rencana-tindak-lanjut')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat jadwal agenda <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Agenda & Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Follow Up & Guidance Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Agenda Evaluasi Mendatang */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Agenda Evaluasi & Tindak Lanjut Terdekat
                </h3>
              </div>
              <span className="text-xs text-slate-400">Jadwal resmi bimbingan</span>
            </div>

            <div className="mt-4 space-y-3">
              {followUpPlans.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  Tidak ada agenda tindak lanjut yang aktif saat ini.
                </div>
              ) : (
                followUpPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {plan.className}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900">{plan.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{plan.objective}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {plan.scheduledDate}
                        </span>
                        <span>•</span>
                        <span>Lokasi: {plan.location}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">Petugas: {plan.assignedOfficer}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Terjadwal
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Ringkasan Status Kesepakatan Kelas */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Status Kesepakatan Kelas per Rombongan Belajar
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('kesepakatan-kelas')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Lihat Semua
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {classes.map((cls) => {
                const agreement = classAgreements.find((a) => a.classId === cls.id && a.status === 'aktif');
                return (
                  <div key={cls.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{cls.name}</span>
                        <span className="text-xs text-slate-500">({cls.department})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Wali Kelas: <span className="font-medium text-slate-700">{cls.homeroomTeacherName}</span> • {cls.totalStudents} Siswa
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {agreement ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Aktif ({agreement.approvalStatus})
                        </span>
                      ) : (
                        <button
                          onClick={onOpenNewAgreement}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          + Buat Kesepakatan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Restorative Educational Pillars & Privacy-Safe Activity */}
        <div className="space-y-6">
          {/* Segitiga Restitusi Guide */}
          <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-teal-300">
              <Compass className="h-5 w-5" />
              <h3 className="font-bold text-base text-white">Pedoman Segitiga Restitusi</h3>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Tiga tahapan dialog restoratif saat mendampingi siswa menghadapi tantangan:
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/30 text-[10px]">
                    1
                  </span>
                  Menstabilkan Identitas
                </div>
                <p className="mt-1 text-[11px] text-slate-300 italic">
                  "Membuat kesalahan adalah bagian dari proses belajar. Kita semua pernah mengalaminya."
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/30 text-[10px]">
                    2
                  </span>
                  Memvalidasi Kebutuhan
                </div>
                <p className="mt-1 text-[11px] text-slate-300 italic">
                  "Kamu pasti punya alasan mengapa melakukan itu. Apa yang sedang kamu butuhkan saat itu?"
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/30 text-[10px]">
                    3
                  </span>
                  Menanyakan Keyakinan Kelas
                </div>
                <p className="mt-1 text-[11px] text-slate-300 italic">
                  "Nilai apa yang telah kita sepakati bersama? Bagaimana kita memperbaikinya bersama?"
                </p>
              </div>
            </div>
          </div>

          {/* Privacy-Preserved Activity Stream */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Aktivitas Sistem Terbaru (Aman & Netral)
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Tanpa Pembongkaran Privasi
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Dashboard umum tidak menampilkan nama siswa atau narasi kasus secara terbuka demi menjaga
              kerahasiaan data anak.
            </p>

            <div className="mt-4 space-y-3">
              {auditLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Belum ada aktivitas operasional yang tercatat di sistem.
                </div>
              ) : (
                auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">{log.action}</div>
                      <div className="text-[11px] text-slate-500">
                        {log.summary} • {log.timestamp.includes('T') ? log.timestamp.split('T')[0] : log.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
