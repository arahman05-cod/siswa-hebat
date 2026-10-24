import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  Calendar,
  Clock,
  UserCheck,
  Phone,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaseHandling } from '../../types';

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseHandling | null;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  const { addCaseProgressNote, updateCaseStatus, currentUser } = useApp();

  // Progress Note Form
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [studentResponse, setStudentResponse] = useState('');
  const [nextCheckDate, setNextCheckDate] = useState('');

  // Status Resolution Form
  const [isResolving, setIsResolving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CaseHandling['status']>('selesai');
  const [resolutionSummary, setResolutionSummary] = useState('');

  if (!isOpen || !caseData) return null;

  const handleSaveProgressNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addCaseProgressNote(caseData.id, newNote, studentResponse, nextCheckDate || undefined);
      setNewNote('');
      setStudentResponse('');
      setNextCheckDate('');
      setIsAddingNote(false);
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan catatan perkembangan.');
    }
  };

  const handleUpdateStatusConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCaseStatus(caseData.id, selectedStatus, resolutionSummary);
      setIsResolving(false);
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status kasus.');
    }
  };

  const getStatusBadge = (st: CaseHandling['status']) => {
    switch (st) {
      case 'baru':
        return { label: 'Baru Diajukan', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'dalam_penanganan':
        return { label: 'Dalam Pendampingan Aktif', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'menunggu_tindak_lanjut':
        return { label: 'Menunggu Evaluasi', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'selesai':
        return { label: 'Tuntas / Selesai Bermartabat', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'dirujuk':
        return { label: 'Dirujuk ke Layanan Khusus', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
  };

  const statusBadge = getStatusBadge(caseData.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-400">
                  {caseData.caseNumber}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                  {caseData.className}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Pendampingan Siswa: {caseData.studentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Status Kasus:</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsResolving(true)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Ubah Status Resmi
              </button>
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 font-semibold text-white hover:bg-teal-500"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Catatan Perkembangan</span>
              </button>
            </div>
          </div>

          {/* Form: Add Progress Note (Expandable) */}
          {isAddingNote && (
            <form
              onSubmit={handleSaveProgressNote}
              className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 text-xs">
                  Tambah Catatan Sesi Perkembangan Baru:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Catatan Observasi & Bimbingan Petugas *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Deskripsikan kemajuan perilaku, pemenuhan tugas, atau dinamika yang diobservasi..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Respon / Refleksi dari Peserta Didik
                </label>
                <input
                  type="text"
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="Contoh: Siswa menyatakan komitmen telah dipenuhi dan merasa lebih tenang..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jadwal Evaluasi Berikutnya (Opsional)
                  </label>
                  <input
                    type="date"
                    value={nextCheckDate}
                    onChange={(e) => setNextCheckDate(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white p-1.5 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Form: Confirm Case Resolution / Status Change */}
          {isResolving && (
            <form
              onSubmit={handleUpdateStatusConfirm}
              className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Konfirmasi Otorisasi Perubahan Status Kasus:
                </span>
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-[11px] text-amber-900 leading-relaxed">
                Sesuai standar operasional, status penyelesaian membutuhkan catatan konfirmasi resmi
                dari petugas penanggung jawab ({currentUser.name}) dan tidak disimpulkan secara otomatis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pilih Status Baru:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as CaseHandling['status'])}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                  >
                    <option value="dalam_penanganan">Dalam Pendampingan Aktif</option>
                    <option value="menunggu_tindak_lanjut">Menunggu Tindak Lanjut</option>
                    <option value="selesai">Selesai / Tuntas Pemulihan Hubungan</option>
                    <option value="dirujuk">Dirujuk ke Layanan Ahli Eksternal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ringkasan Evaluasi / Bukti Pemulihan *
                  </label>
                  <input
                    type="text"
                    required
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    placeholder="Contoh: Siswa telah menyelesaikan target mandiri dan komitmen kelas dipulihkan."
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                >
                  Konfirmasi Pembaruan Status
                </button>
              </div>
            </form>
          )}

          {/* Key Case Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-slate-400 block text-[11px]">Petugas Penanggung Jawab:</span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {caseData.assignedOfficerName}
              </span>
              <span className="text-[10px] text-teal-700">{caseData.assignedOfficerRole}</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-slate-400 block text-[11px]">Tanggal Target Evaluasi:</span>
              <span className="font-bold text-slate-800 block mt-0.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {caseData.targetEvaluationDate}
              </span>
              <span className="text-[10px] text-slate-500">Evaluasi berkala</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-slate-400 block text-[11px]">Rujukan Catatan Kejadian:</span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {caseData.incidentNumber}
              </span>
              <span className="text-[10px] text-slate-500">Terdokumentasi resmi</span>
            </div>
          </div>

          {/* Discussion & Steps */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <h4 className="font-bold text-slate-900 mb-1.5">Hasil Pembahasan & Dialog Restoratif</h4>
              <p className="text-slate-700 leading-relaxed">{caseData.discussionSummary}</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <h4 className="font-bold text-slate-900 mb-1.5">Target Perbaikan Positif yang Realistis</h4>
              <p className="text-slate-700 font-medium bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                "{caseData.improvementTarget}"
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <h4 className="font-bold text-slate-900 mb-1.5">Langkah-Langkah Pendampingan</h4>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                {caseData.guidanceSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Parent Communication */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-600" />
                <h4 className="font-bold text-slate-900">Komunikasi dengan Orang Tua / Wali</h4>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  caseData.parentCommunication.conducted
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {caseData.parentCommunication.conducted ? 'Sudah Dilakukan' : 'Belum Diperlukan'}
              </span>
            </div>
            {caseData.parentCommunication.conducted && (
              <div className="text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Metode: {caseData.parentCommunication.method}</span>
                  <span>Tanggal: {caseData.parentCommunication.date}</span>
                </div>
                <p className="text-slate-800 italic">{caseData.parentCommunication.notes}</p>
              </div>
            )}
          </div>

          {/* Chronological Progress Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-teal-600" />
                <span>Linimasa Catatan Perkembangan Kronologis ({caseData.progressNotes.length})</span>
              </h4>
            </div>

            <div className="space-y-3">
              {caseData.progressNotes.map((pn, idx) => (
                <div
                  key={pn.id || idx}
                  className="relative pl-6 pb-2 border-l-2 border-teal-400 last:border-transparent"
                >
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-teal-600 ring-4 ring-white" />
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-800">
                        {pn.officerName} ({pn.officerRole})
                      </span>
                      <span>
                        {pn.date} • {pn.time}
                      </span>
                    </div>

                    <p className="text-slate-700">{pn.note}</p>

                    {pn.studentResponse && (
                      <div className="text-[11px] text-teal-900 bg-teal-50/70 p-2 rounded-lg border border-teal-100">
                        <span className="font-bold">Respon Siswa:</span> {pn.studentResponse}
                      </div>
                    )}

                    {pn.nextCheckDate && (
                      <div className="text-[10px] text-slate-400">
                        Jadwal cek berikutnya: {pn.nextCheckDate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-teal-600" />
            <span>Dokumentasi tersimpan dalam jejak audit berwenang.</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Tutup Berkas
          </button>
        </div>
      </div>
    </div>
  );
};
