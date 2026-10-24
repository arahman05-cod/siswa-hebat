import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Share2,
  Printer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentRecord } from '../../types';

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: IncidentRecord | null;
  onOpenCaseForm?: (incident: IncidentRecord) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  onOpenCaseForm,
}) => {
  const { updateIncidentStatus, currentUser } = useApp();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!isOpen || !record) return null;

  const handleSetStatus = (status: IncidentRecord['status']) => {
    updateIncidentStatus(record.id, status);
    setIsUpdatingStatus(false);
  };

  const getStatusBadge = (st: IncidentRecord['status']) => {
    switch (st) {
      case 'baru':
        return { label: 'Catatan Baru', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'dalam_tindak_lanjut':
        return { label: 'Dalam Tindak Lanjut', color: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'selesai_di_kelas':
        return { label: 'Selesai di Tingkat Kelas', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'dialihkan_ke_bk':
        return { label: 'Dialihkan ke Bimbingan Konseling', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
  };

  const statusBadge = getStatusBadge(record.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400">
                  {record.recordNumber}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {record.className}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Catatan Faktual: {record.studentName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Cetak Catatan Ini"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          {/* Status & Confidentiality Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Status Penanganan:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Kerahasiaan: {record.confidentialityLevel.toUpperCase().replace('_', ' ')}</span>
            </div>
          </div>

          {/* Incident Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Tanggal:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3 text-slate-400" />
                {record.date}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Waktu:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-slate-400" />
                {record.time}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Lokasi:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                {record.location}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pencatat:</span>
              <span className="font-semibold text-slate-800 truncate block mt-0.5">
                {record.recorderName.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Section 1: Factual Observation */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              1. Uraian Faktual yang Diamati Langsung (Objektif)
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">{record.factualObservation}</p>
          </div>

          {/* Section 2: Student Perspective */}
          <div className="rounded-xl border border-teal-200 p-4 bg-teal-50/40">
            <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              2. Keterangan / Sudut Pandang Peserta Didik
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs italic bg-white/80 p-3 rounded-lg border border-teal-100">
              "{record.studentPerspective || 'Belum ada keterangan langsung dari siswa.'}"
            </p>
          </div>

          {/* Section 3: Initial Action */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              3. Tindakan Awal & Pendampingan di Lokasi
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">{record.initialActionTaken}</p>
          </div>

          {/* Section 4: Supporting / Witness */}
          {record.witnessesOrSupporting && (
            <div className="text-slate-600 text-xs px-1">
              <span className="font-bold text-slate-700">Saksi / Dokumen Pendukung:</span>{' '}
              {record.witnessesOrSupporting}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetStatus('selesai_di_kelas')}
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Tandai Selesai di Kelas
            </button>
            <button
              onClick={() => handleSetStatus('dialihkan_ke_bk')}
              className="rounded-xl border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100"
            >
              Alihkan ke BK
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCaseForm && record.status !== 'selesai_di_kelas' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCaseForm(record);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 shadow-sm transition-colors"
              >
                <span>Buka Penanganan Terstruktur</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
