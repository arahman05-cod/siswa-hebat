import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  RotateCcw,
  UserCheck,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FollowUpPlan } from '../types';

export const FollowUpPlanPage: React.FC = () => {
  const { followUpPlans, createFollowUpPlan, updateFollowUpPlanStatus, classes, students, currentUser } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'terjadwal' | 'berlangsung' | 'selesai'>('all');

  // Modal to add new plan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState(students[0]?.name || 'Rian Pratama (Fiktif)');
  const [className, setClassName] = useState(classes[0]?.name || 'XI TLM');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState('Ruang Bimbingan Konseling 1');
  const [assignedOfficer, setAssignedOfficer] = useState(currentUser.name);
  const [objective, setObjective] = useState('');

  const filteredPlans = followUpPlans.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFollowUpPlan({
        title,
        studentName,
        className,
        scheduledDate,
        location,
        assignedOfficer,
        objective,
      });
      setIsModalOpen(false);
      setTitle('');
      setObjective('');
    } catch (err: any) {
      alert(err.message || 'Gagal menjadwalkan rencana tindak lanjut.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Agenda & Rencana Tindak Lanjut (RTL)</h2>
          <p className="text-xs text-slate-500">
            Penjadwalan sesi evaluasi, dialog segitiga restitusi, dan monitoring target positif siswa
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Jadwalkan Tindak Lanjut Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari agenda, siswa, pembimbing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {(['all', 'terjadwal', 'berlangsung', 'selesai'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              {st === 'all'
                ? 'Semua'
                : st === 'terjadwal'
                ? 'Terjadwal'
                : st === 'berlangsung'
                ? 'Berlangsung'
                : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 border border-teal-200">
                      {plan.className}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{plan.planNumber}</span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-slate-900">{plan.title}</h3>
                  <div className="text-xs text-slate-600 font-medium">Siswa: {plan.studentName}</div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                    plan.status === 'selesai'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : plan.status === 'berlangsung'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {plan.status === 'selesai'
                    ? 'Tuntas'
                    : plan.status === 'berlangsung'
                    ? 'Berlangsung'
                    : 'Terjadwal'}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {plan.objective}
              </p>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Jadwal: <strong>{plan.scheduledDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>Lokasi: {plan.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Petugas: {plan.assignedOfficer}</span>
                </div>
              </div>
            </div>

            {/* Status change buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              {plan.status !== 'selesai' ? (
                <button
                  onClick={() => updateFollowUpPlanStatus(plan.id, 'selesai')}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-500 shadow-2xs"
                >
                  Tandai Selesai Tuntas
                </button>
              ) : (
                <button
                  onClick={() => updateFollowUpPlanStatus(plan.id, 'terjadwal')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Buka Kembali
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Follow Up Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Jadwalkan Tindak Lanjut Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-200 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Agenda RTL *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Sesi Evaluasi Perbaikan Ritme Belajar & Dialog Empatik"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rombel (Kelas) *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Siswa *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nama Siswa Terkait"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Rencana *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Pertemuan *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan Sesi / Indikator Capaian *</label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Jelaskan apa yang ingin dicapai dalam sesi tindak lanjut ini..."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-500"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
