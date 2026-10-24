import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  AlertCircle,
  Shield,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface IncidentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentRecordModal: React.FC<IncidentRecordModalProps> = ({ isOpen, onClose }) => {
  const { classes, students, currentUser, createIncidentRecord } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-xi-ak');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')} WIB`
  );
  const [location, setLocation] = useState('Ruang Kelas / Praktikum');
  const [factualObservation, setFactualObservation] = useState('');
  const [studentPerspective, setStudentPerspective] = useState('');
  const [initialActionTaken, setInitialActionTaken] = useState('');
  const [witnessesOrSupporting, setWitnessesOrSupporting] = useState('');
  const [confidentialityLevel, setConfidentialityLevel] = useState<
    'internal_kelas' | 'terbatas_bk' | 'rahasia_tim'
  >('internal_kelas');

  const [manualStudentName, setManualStudentName] = useState('');

  if (!isOpen) return null;

  const currentClassStudents = students.filter((s) => s.classId === selectedClassId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === selectedClassId);
    const targetStudent = students.find((s) => s.id === selectedStudentId);
    const finalStudentName = targetStudent?.name || manualStudentName.trim() || 'Peserta Didik';

    try {
      await createIncidentRecord({
        classId: selectedClassId,
        className: targetClass?.name || 'Kelas',
        studentId: selectedStudentId || `std-${Date.now()}`,
        studentName: finalStudentName,
        date,
        time,
        location,
        factualObservation,
        studentPerspective,
        initialActionTaken,
        witnessesOrSupporting,
        confidentialityLevel,
        status: 'baru',
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan catatan kejadian.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pencatatan Kejadian Faktual Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Dokumentasi netral, objektif, dan berorientasi pendampingan (Tanpa Stigma)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Ethics reminder */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Pedoman Penulisan Catatan Faktual:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Tuliskan apa yang benar-benar <strong>terlihat dan terdengar langsung</strong>. Hindari
                asumsi seperti "siswa malas" atau label kejiwaan/stigma yang belum terverifikasi secara resmi.
              </p>
            </div>
          </div>

          {/* Row 1: Kelas, Siswa Terkait, Tingkat Rahasia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rombongan Belajar (Kelas) *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const firstStd = students.find((s) => s.classId === e.target.value);
                  if (firstStd) setSelectedStudentId(firstStd.id);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} • {cls.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peserta Didik Terkait *
              </label>
              {currentClassStudents.length === 0 ? (
                <input
                  type="text"
                  required
                  placeholder="Ketik nama peserta didik..."
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {currentClassStudents.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.name} (NISN: {std.nisn})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kerahasiaan Arsip *
              </label>
              <select
                value={confidentialityLevel}
                onChange={(e) =>
                  setConfidentialityLevel(
                    e.target.value as 'internal_kelas' | 'terbatas_bk' | 'rahasia_tim'
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="internal_kelas">Internal Kelas & Wali Kelas</option>
                <option value="terbatas_bk">Terbatas Tim Bimbingan Konseling</option>
                <option value="rahasia_tim">Sangat Rahasia (Pimpinan & BK)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Tanggal, Waktu, Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Kejadian *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Waktu Kejadian *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Contoh: 09:15 WIB"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lokasi Kejadian *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lab Komputer RPL 1 / Lapangan Upacara"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Uraian Faktual (Fakta Objektif) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                1. Uraian Faktual Kejadian (Objektif & Konkret) *
              </label>
              <span className="text-[11px] text-slate-400">Hanya fakta teramati</span>
            </div>
            <textarea
              required
              rows={3}
              value={factualObservation}
              onChange={(e) => setFactualObservation(e.target.value)}
              placeholder="Jelaskan secara runtut apa yang terjadi, apa yang dilihat/didengar langsung tanpa menyertakan prasangka pribadi..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Keterangan & Perspektif Siswa */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                2. Keterangan / Sudut Pandang Peserta Didik (Didengarkan Secara Tulus) *
              </label>
              <span className="text-[11px] text-teal-700 font-medium">Prinsip Hak Suara Anak</span>
            </div>
            <textarea
              required
              rows={2}
              value={studentPerspective}
              onChange={(e) => setStudentPerspective(e.target.value)}
              placeholder="Tuliskan penjelasan atau alasan yang diutarakan siswa saat diajak berdialog secara tenang..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Tindakan Awal yang Telah Dilakukan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                3. Tindakan Awal yang Telah Dilakukan di Tempat *
              </label>
              <span className="text-[11px] text-slate-400">Respon pertama guru/petugas</span>
            </div>
            <textarea
              required
              rows={2}
              value={initialActionTaken}
              onChange={(e) => setInitialActionTaken(e.target.value)}
              placeholder="Contoh: Mengajak siswa berdialog tenang berdua di ruang perwalian, memisahkan pihak berkonflik, memberikan air minum..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Saksi / Dokumen Pendukung */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              4. Saksi atau Dokumen Pendukung (Jika Diperlukan)
            </label>
            <input
              type="text"
              value={witnessesOrSupporting}
              onChange={(e) => setWitnessesOrSupporting(e.target.value)}
              placeholder="Contoh: Ketua kelas yang mendampingi atau lembar log presensi..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Pencatat */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500">Petugas Pencatat Resmi:</span>
            <span className="font-semibold text-slate-800">
              {currentUser.name} ({currentUser.roleLabel})
            </span>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle className="h-4 w-4 text-amber-600" />
            <span>Nomor catatan otomatis digenerate dengan penanda unik</span>
          </div>

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
              className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500"
            >
              Simpan Catatan Kejadian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
