import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  ScrollText,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassAgreement } from '../../types';
import { agreementTemplates } from '../../data/agreementTemplates';

interface ClassAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClassId?: string;
  editingAgreement?: ClassAgreement | null;
}

export const ClassAgreementModal: React.FC<ClassAgreementModalProps> = ({
  isOpen,
  onClose,
  initialClassId,
  editingAgreement,
}) => {
  const { classes, currentUser, createClassAgreement, updateClassAgreement } = useApp();

  const [classId, setClassId] = useState(initialClassId || classes[0]?.id || 'cls-xi-ak');
  const [title, setTitle] = useState('');
  const [objectives, setObjectives] = useState('');
  const [positiveRules, setPositiveRules] = useState<string[]>(['']);
  const [teacherResponsibilities, setTeacherResponsibilities] = useState<string[]>(['']);
  const [studentResponsibilities, setStudentResponsibilities] = useState<string[]>(['']);
  const [educationalConsequences, setEducationalConsequences] = useState<string[]>(['']);
  const [evaluationMethod, setEvaluationMethod] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [studentRepresentativeName, setStudentRepresentativeName] = useState('Ketua Kelas');
  const [participantsCount, setParticipantsCount] = useState<number>(34);
  const [revisionSummary, setRevisionSummary] = useState('');

  // Load editing data if available
  useEffect(() => {
    if (editingAgreement) {
      setClassId(editingAgreement.classId);
      setTitle(editingAgreement.title);
      setObjectives(editingAgreement.objectives);
      setPositiveRules(editingAgreement.positiveRules);
      setTeacherResponsibilities(editingAgreement.teacherResponsibilities);
      setStudentResponsibilities(editingAgreement.studentResponsibilities);
      setEducationalConsequences(editingAgreement.educationalConsequences);
      setEvaluationMethod(editingAgreement.evaluationMethod);
      setReviewDate(editingAgreement.reviewDate);
      setStudentRepresentativeName(editingAgreement.studentRepresentativeName);
      setParticipantsCount(editingAgreement.participantsCount);
    } else {
      // Set defaults
      const selectedClass = classes.find((c) => c.id === (initialClassId || classes[0]?.id));
      if (selectedClass) {
        setClassId(selectedClass.id);
        setTitle(`Kesepakatan Belajar Kolaboratif & Budaya Positif ${selectedClass.name}`);
        setParticipantsCount(selectedClass.totalStudents);
      }
      setObjectives(
        'Menciptakan ruang belajar yang aman, inklusif, saling menghargai pendapat, dan bertanggung jawab bersama.'
      );
      setPositiveRules([
        'Hadir tepat waktu dan siap memulai pembelajaran dengan semangat.',
        'Mendengarkan dengan tulus saat rekan atau guru sedang berbicara.',
        'Menjaga kebersihan dan kenyamanan ruang belajar bersama.',
      ]);
      setTeacherResponsibilities([
        'Memfasilitasi pembelajaran dengan ramah, jelas, dan adil.',
        'Mendengarkan pertanyaan dan aspirasi belajar siswa tanpa prasangka.',
      ]);
      setStudentResponsibilities([
        'Aktif berkontribusi dalam diskusi dan tugas kelompok.',
        'Menghargai keberagaman serta menjaga kenyamanan rekan sekelas.',
      ]);
      setEducationalConsequences([
        'Refleksi mandiri tertulis mengenai dampak tindakan terhadap kenyamanan kelas.',
        'Dialog restoratif bersama pihak terdampak untuk mencari solusi damai.',
      ]);
      setEvaluationMethod('Refleksi dua pekan sekali setiap hari Jumat.');
      setReviewDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setStudentRepresentativeName('Ketua Kelas / Perwakilan Siswa');
    }
  }, [editingAgreement, initialClassId, classes, isOpen]);

  if (!isOpen) return null;

  // Template loader
  const handleApplyTemplate = (templateId: string) => {
    const tmpl = agreementTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    setTitle(tmpl.title);
    setObjectives(tmpl.objectives);
    setPositiveRules([...tmpl.positiveRules]);
    setTeacherResponsibilities([...tmpl.teacherResponsibilities]);
    setStudentResponsibilities([...tmpl.studentResponsibilities]);
    setEducationalConsequences([...tmpl.educationalConsequences]);
    setEvaluationMethod(tmpl.evaluationMethod);
  };

  // Dynamic array helpers
  const handleAddRule = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const handleUpdateItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === classId);

    const payload = {
      classId,
      className: targetClass?.name || 'Kelas',
      title,
      objectives,
      positiveRules: positiveRules.filter((r) => r.trim() !== ''),
      teacherResponsibilities: teacherResponsibilities.filter((r) => r.trim() !== ''),
      studentResponsibilities: studentResponsibilities.filter((r) => r.trim() !== ''),
      educationalConsequences: educationalConsequences.filter((r) => r.trim() !== ''),
      evaluationMethod,
      reviewDate,
      studentRepresentativeName,
      participantsCount,
      homeroomTeacherName: currentUser.name,
    };

    try {
      if (editingAgreement) {
        await updateClassAgreement(
          editingAgreement.id,
          payload,
          revisionSummary || `Revisi kesepakatan oleh ${currentUser.name}`
        );
      } else {
        await createClassAgreement(payload);
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan kesepakatan kelas.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingAgreement ? 'Perbarui Kesepakatan Kelas' : 'Susun Kesepakatan Kelas Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Pendekatan positif, partisipatif, dan berbasis budaya restoratif
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Template Quick Selector */}
          {!editingAgreement && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>Gunakan Templat Praktis Siap Pakai:</span>
                </div>
                <span className="text-[11px] text-teal-700">Dapat disesuaikan kembali</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {agreementTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.id)}
                    className="flex flex-col items-start rounded-lg border border-teal-200 bg-white p-2.5 text-left hover:border-teal-400 hover:bg-teal-50 transition-all text-xs"
                  >
                    <span className="font-bold text-slate-800">{tmpl.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                      {tmpl.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 1: Kelas, Jumlah Siswa, Tanggal Evaluasi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rombongan Belajar (Kelas) *
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={!!editingAgreement}
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
                Jumlah Peserta Terlibat *
              </label>
              <input
                type="number"
                min="1"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Agenda Evaluasi Berkala *
              </label>
              <input
                type="date"
                required
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Kesepakatan Kelas *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kesepakatan Belajar Kolaboratif & Budaya Positif XI PPLG 1"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tujuan Bersama & Visi Kelas *
            </label>
            <textarea
              required
              rows={2}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Jelaskan suasana dan tujuan pembelajaran yang ingin diwujudkan bersama..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Section: Aturan Positif (Bukan Larangan Negatif) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Aturan & Kebiasaan Positif (Kalimat Mengajak, Bukan Melarang) *
                </label>
                <span className="text-[11px] text-slate-500">
                  Gunakan kalimat afirmatif seperti: "Hadir tepat waktu", bukan "Dilarang terlambat".
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAddRule(setPositiveRules)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Poin
              </button>
            </div>

            <div className="space-y-2">
              {positiveRules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-teal-700 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    required
                    value={rule}
                    onChange={(e) => handleUpdateItem(setPositiveRules, idx, e.target.value)}
                    placeholder="Contoh: Saling mendengarkan dengan penuh perhatian saat teman berpendapat"
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  {positiveRules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(setPositiveRules, idx)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Tanggung Jawab Guru & Siswa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guru Responsibilities */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Tanggung Jawab Guru / Wali Kelas
                </label>
                <button
                  type="button"
                  onClick={() => handleAddRule(setTeacherResponsibilities)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  + Tambah
                </button>
              </div>
              {teacherResponsibilities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleUpdateItem(setTeacherResponsibilities, idx, e.target.value)
                    }
                    placeholder="Contoh: Mengajar dengan ramah dan adil"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  {teacherResponsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(setTeacherResponsibilities, idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Siswa Responsibilities */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Tanggung Jawab Peserta Didik
                </label>
                <button
                  type="button"
                  onClick={() => handleAddRule(setStudentResponsibilities)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  + Tambah
                </button>
              </div>
              {studentResponsibilities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleUpdateItem(setStudentResponsibilities, idx, e.target.value)
                    }
                    placeholder="Contoh: Mengerjakan tugas tepat waktu & saling menghormati"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  {studentResponsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(setStudentResponsibilities, idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Konsekuensi Edukatif & Pemulihan Bermakna */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Konsekuensi Edukatif / Tindakan Restoratif *
                </label>
                <span className="text-[11px] text-slate-500">
                  Berorientasi memperbaiki keadaan dan belajar dari kesalahan (bukan hukuman fisik/mempermalukan).
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAddRule(setEducationalConsequences)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                + Tambah Konsekuensi
              </button>
            </div>

            <div className="space-y-2">
              {educationalConsequences.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-teal-700 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    required
                    value={item}
                    onChange={(e) =>
                      handleUpdateItem(setEducationalConsequences, idx, e.target.value)
                    }
                    placeholder="Contoh: Dialog reflektif bersama pihak terkait dan merumuskan solusi win-win"
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  {educationalConsequences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(setEducationalConsequences, idx)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cara Evaluasi & Nama Perwakilan Siswa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cara / Mekanisme Evaluasi Berkala *
              </label>
              <input
                type="text"
                required
                value={evaluationMethod}
                onChange={(e) => setEvaluationMethod(e.target.value)}
                placeholder="Contoh: Refleksi kelas 2 pekan sekali setiap hari Jumat"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Perwakilan Siswa / Ketua Kelas *
              </label>
              <input
                type="text"
                required
                value={studentRepresentativeName}
                onChange={(e) => setStudentRepresentativeName(e.target.value)}
                placeholder="Nama Ketua Kelas atau Perwakilan Siswa"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Revision Note if editing */}
          {editingAgreement && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Revisi / Alasan Pembaruan
              </label>
              <input
                type="text"
                value={revisionSummary}
                onChange={(e) => setRevisionSummary(e.target.value)}
                placeholder="Jelaskan penyesuaian aturan atau hasil evaluasi kelas..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle className="h-4 w-4 text-teal-600" />
            <span>Disetujui seluruh siswa & guru</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors"
            >
              {editingAgreement ? 'Simpan Revisi Kesepakatan' : 'Sahkan & Simpan Kesepakatan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
