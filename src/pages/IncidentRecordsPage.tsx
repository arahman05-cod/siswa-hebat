import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentRecord } from '../types';

interface IncidentRecordsPageProps {
  onOpenNewIncident: () => void;
  onViewIncidentDetail: (record: IncidentRecord) => void;
  onOpenCaseForm: (incident: IncidentRecord) => void;
}

export const IncidentRecordsPage: React.FC<IncidentRecordsPageProps> = ({
  onOpenNewIncident,
  onViewIncidentDetail,
  onOpenCaseForm,
}) => {
  const { incidentRecords, classes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    'all' | 'baru' | 'dalam_tindak_lanjut' | 'selesai_di_kelas' | 'dialihkan_ke_bk'
  >('all');

  const filteredRecords = incidentRecords.filter((record) => {
    const matchesClass = selectedClassFilter === 'all' || record.classId === selectedClassFilter;
    const matchesStatus =
      selectedStatusFilter === 'all' || record.status === selectedStatusFilter;
    const matchesSearch =
      record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (st: IncidentRecord['status']) => {
    switch (st) {
      case 'baru':
        return {
          label: 'Baru',
          cls: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'dalam_tindak_lanjut':
        return {
          label: 'Dalam Tindak Lanjut',
          cls: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'selesai_di_kelas':
        return {
          label: 'Selesai di Kelas',
          cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'dialihkan_ke_bk':
        return {
          label: 'Dialihkan ke BK',
          cls: 'bg-purple-50 text-purple-700 border-purple-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jurnal Catatan Kejadian Faktual</h2>
          <p className="text-xs text-slate-500">
            Pencatatan kejadian objektif, suara peserta didik, dan respon awal tanpa label penghakiman
          </p>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Catat Kejadian Faktual Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor, siswa, lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Kelas:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {(['all', 'baru', 'dalam_tindak_lanjut', 'selesai_di_kelas', 'dialihkan_ke_bk'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  selectedStatusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                {st === 'all'
                  ? 'Semua'
                  : st === 'baru'
                  ? 'Baru'
                  : st === 'dalam_tindak_lanjut'
                  ? 'Tindak Lanjut'
                  : st === 'selesai_di_kelas'
                  ? 'Selesai di Kelas'
                  : 'Ke BK'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Incident Records Table / Cards */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            Tidak ada catatan kejadian yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredRecords.map((record) => {
            const badge = getStatusBadge(record.status);
            return (
              <div
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {record.recordNumber}
                    </span>
                    <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 border border-teal-200">
                      {record.className}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{record.studentName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Pencatat: {record.recorderName.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* 3-Box Educational Separation: Facts vs Student Voice vs Initial Action */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Fakta yang Diamati */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs space-y-1">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Fakta Teramati:
                    </div>
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {record.factualObservation}
                    </p>
                  </div>

                  {/* Perspektif Siswa */}
                  <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-3 text-xs space-y-1">
                    <div className="font-bold text-teal-900 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                      Sudut Pandang Siswa:
                    </div>
                    <p className="text-slate-600 italic line-clamp-3 leading-relaxed">
                      "{record.studentPerspective || 'Belum ada catatan sudut pandang.'}"
                    </p>
                  </div>

                  {/* Tindakan Awal */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Tindakan Awal Guru:
                    </div>
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {record.initialActionTaken}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {record.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {record.time}
                    </span>
                    <span>•</span>
                    <span>Lokasi: {record.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewIncidentDetail(record)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Lihat Rinci</span>
                    </button>

                    {record.status !== 'selesai_di_kelas' && (
                      <button
                        onClick={() => onOpenCaseForm(record)}
                        className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 shadow-2xs"
                      >
                        <span>Buka Penanganan</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
