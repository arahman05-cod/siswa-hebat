import React, { useState, useEffect } from 'react';
import {
  X,
  HeartHandshake,
  UserCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { IncidentRecord } from '../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentRecord | null;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const { createCaseFromIncident, currentUser } = useApp();

  const [assignedOfficerId, setAssignedOfficerId] = useState('user-2'); // default to Guru BK
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  useEffect(() => {
    if (incident) {
      setDiscussionSummary(
        `Pendampingan terfokus pada ${incident.studentName} terkait pemulihan komitmen belajar dan penyelarasan kendala yang dialami di kelas.`
      );
    }
  }, [incident]);

  if (!isOpen || !incident) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCaseFromIncident(incident.id, assignedOfficerId, discussionSummary, targetDate);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal membuka kasus pendampingan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inisiasi Kasus & Pendampingan Restoratif
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan catatan kejadian dengan program bimbingan terencana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Reference Incident Info */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Berdasarkan Catatan Kejadian:</span>
              <span className="font-mono font-bold text-slate-800">{incident.recordNumber}</span>
            </div>
            <div className="text-slate-800 font-semibold">
              Siswa: {incident.studentName} ({incident.className})
            </div>
          </div>

          {/* Assigned Officer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Petugas Pembimbing / Konselor Penanggung Jawab *
            </label>
            <select
              value={assignedOfficerId}
              onChange={(e) => setAssignedOfficerId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="user-2">Budi Santoso, S.Pd., Kons. (Guru Bimbingan Konseling)</option>
              <option value="user-1">Ahmad Rahman, S.Kom. (Wali Kelas XI TLM)</option>
              <option value="user-3">Dra. Hj. Siti Nurhaliza, M.Pd. (Kepala Sekolah)</option>
            </select>
          </div>

          {/* Discussion Summary & Initial Guidance Plan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rencana Awal Pendampingan & Pembahasan *
            </label>
            <textarea
              required
              rows={3}
              value={discussionSummary}
              onChange={(e) => setDiscussionSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Target Evaluation Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Tanggal Evaluasi Pertama *
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <span className="text-[11px] text-slate-400">
            Hak akses berkas dibatasi untuk petugas penanggung jawab
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500"
            >
              Buka Penanganan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
