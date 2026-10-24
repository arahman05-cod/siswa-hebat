import React, { useState } from 'react';
import {
  HeartHandshake,
  Search,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Shield,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CaseHandling } from '../types';

interface CaseHandlingPageProps {
  onViewCaseDetail: (caseData: CaseHandling) => void;
}

export const CaseHandlingPage: React.FC<CaseHandlingPageProps> = ({ onViewCaseDetail }) => {
  const { caseHandlings, classes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    'all' | 'baru' | 'dalam_penanganan' | 'menunggu_tindak_lanjut' | 'selesai' | 'dirujuk'
  >('all');

  const filteredCases = caseHandlings.filter((c) => {
    const matchesClass = selectedClassFilter === 'all' || c.classId === selectedClassFilter;
    const matchesStatus = selectedStatusFilter === 'all' || c.status === selectedStatusFilter;
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedOfficerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (st: CaseHandling['status']) => {
    switch (st) {
      case 'baru':
        return { label: 'Baru', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'dalam_penanganan':
        return { label: 'Dalam Pendampingan', cls: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'menunggu_tindak_lanjut':
        return { label: 'Menunggu Evaluasi', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'selesai':
        return { label: 'Tuntas Selesai', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'dirujuk':
        return { label: 'Dirujuk Ahli', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Penanganan & Pendampingan Kasus Restoratif
          </h2>
          <p className="text-xs text-slate-500">
            Dokumentasi pendampingan terstruktur, komunikasi wali, dan pemenuhan target perbaikan positif
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor kasus, nama siswa..."
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

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {(['all', 'dalam_penanganan', 'menunggu_tindak_lanjut', 'selesai'] as const).map(
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
                  : st === 'dalam_penanganan'
                  ? 'Aktif'
                  : st === 'menunggu_tindak_lanjut'
                  ? 'Evaluasi'
                  : 'Selesai'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            Tidak ada data kasus pendampingan yang sesuai dengan filter.
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            const badge = getStatusBadge(caseItem.status);
            return (
              <div
                key={caseItem.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow"
              >
                <div>
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {caseItem.caseNumber}
                        </span>
                        <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 border border-teal-200">
                          {caseItem.className}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-base font-bold text-slate-900">
                        {caseItem.studentName}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Summary & Target */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                        Target Perbaikan Positif:
                      </span>
                      <p className="text-slate-700 font-medium line-clamp-2">
                        "{caseItem.improvementTarget}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px]">
                      <span>
                        Pembimbing: <strong>{caseItem.assignedOfficerName.split(',')[0]}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-teal-700">
                        <MessageSquare className="h-3 w-3" />
                        {caseItem.progressNotes.length} Sesi Perkembangan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    Target Evaluasi: {caseItem.targetEvaluationDate}
                  </span>

                  <button
                    onClick={() => onViewCaseDetail(caseItem)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Buka Berkas</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
