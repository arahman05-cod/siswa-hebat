import React, { useState } from 'react';
import {
  ScrollText,
  Plus,
  Eye,
  Edit3,
  Archive,
  History,
  CheckCircle2,
  Calendar,
  Users,
  Search,
  FileCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassAgreement } from '../types';

interface ClassAgreementPageProps {
  onOpenNewAgreement: (classId?: string) => void;
  onEditAgreement: (agreement: ClassAgreement) => void;
  onPreviewAgreement: (agreement: ClassAgreement) => void;
}

export const ClassAgreementPage: React.FC<ClassAgreementPageProps> = ({
  onOpenNewAgreement,
  onEditAgreement,
  onPreviewAgreement,
}) => {
  const { classAgreements, updateClassAgreement, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'draf' | 'diarsipkan'>('all');
  const [viewingRevisions, setViewingRevisions] = useState<ClassAgreement | null>(null);

  const filteredAgreements = classAgreements.filter((agr) => {
    const matchesStatus = statusFilter === 'all' || agr.status === statusFilter;
    const matchesSearch =
      agr.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agr.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleToggleArchive = (agreement: ClassAgreement) => {
    const newStatus = agreement.status === 'aktif' ? 'diarsipkan' : 'aktif';
    const actionLabel = newStatus === 'aktif' ? 'mengaktifkan kembali' : 'mengarsipkan';
    if (window.confirm(`Apakah Anda yakin ingin ${actionLabel} kesepakatan ${agreement.className}?`)) {
      updateClassAgreement(agreement.id, { status: newStatus }, `${currentUser.name} mengubah status menjadi ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Modul Kesepakatan & Budaya Positif Kelas</h2>
          <p className="text-xs text-slate-500">
            Penyusunan aturan positif partisipatif, komitmen belajar, dan dokumen kesepakatan kelas
          </p>
        </div>

        <button
          onClick={() => onOpenNewAgreement()}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Susun Kesepakatan Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kelas, judul kesepakatan, nomor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {(['all', 'aktif', 'draf', 'diarsipkan'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              {st === 'all'
                ? 'Semua'
                : st === 'aktif'
                ? 'Aktif'
                : st === 'draf'
                ? 'Draf'
                : 'Diarsipkan'}
            </button>
          ))}
        </div>
      </div>

      {/* Agreement Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAgreements.map((agreement) => (
          <div
            key={agreement.id}
            className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-2xs transition-all hover:shadow-sm ${
              agreement.status === 'aktif' ? 'border-teal-200/80 ring-1 ring-teal-500/10' : 'border-slate-200 opacity-80'
            }`}
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-bold text-white">
                      {agreement.className}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {agreement.agreementNumber}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-1">
                    {agreement.title}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      agreement.status === 'aktif'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {agreement.status === 'aktif' ? 'Status: Aktif' : 'Diarsipkan'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {agreement.participantsCount} Siswa Terlibat
                  </span>
                </div>
              </div>

              {/* Objectives Snippet */}
              <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                "{agreement.objectives}"
              </p>

              {/* Positive Rules Highlights */}
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contoh Norma Positif Disepakati:
                </span>
                <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
                  {agreement.positiveRules.slice(0, 3).map((rule, idx) => (
                    <li key={idx} className="line-clamp-1">
                      {rule}
                    </li>
                  ))}
                  {agreement.positiveRules.length > 3 && (
                    <li className="text-slate-400 text-[11px] list-none pl-0">
                      + {agreement.positiveRules.length - 3} aturan positif lainnya...
                    </li>
                  )}
                </ul>
              </div>

              {/* Meta footer info */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Ditetapkan: {agreement.establishedDate}
                </span>
                <span>•</span>
                <span>Evaluasi: {agreement.reviewDate}</span>
                <span>•</span>
                <span>Wali: {agreement.homeroomTeacherName}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingRevisions(agreement)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Revisi ({agreement.revisions.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleArchive(agreement)}
                  title={agreement.status === 'aktif' ? 'Arsipkan' : 'Aktifkan'}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <Archive className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onEditAgreement(agreement)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onPreviewAgreement(agreement)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 shadow-2xs transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Pratinjau & Cetak</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: View Revisions History */}
      {viewingRevisions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Riwayat Revisi Kesepakatan
                </h3>
                <p className="text-xs text-slate-500">{viewingRevisions.className} • {viewingRevisions.agreementNumber}</p>
              </div>
              <button
                onClick={() => setViewingRevisions(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {viewingRevisions.revisions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Belum ada riwayat revisi tercatat.
                </div>
              ) : (
                viewingRevisions.revisions.map((rev) => (
                  <div key={rev.id} className="relative pl-6 pb-4 border-l-2 border-teal-500 last:border-transparent">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-teal-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Revisi ke-{rev.revisionNumber}</span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Penyusun: {rev.authorName} ({rev.authorRole})
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      {rev.summaryOfChange}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingRevisions(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
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
