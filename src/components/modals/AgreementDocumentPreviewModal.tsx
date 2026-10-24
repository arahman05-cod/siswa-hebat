import React from 'react';
import {
  X,
  Printer,
  FileDown,
  ArrowLeft,
  Building2,
  CheckCircle2,
  History,
  Shield,
} from 'lucide-react';
import { ClassAgreement, SchoolProfile } from '../../types';

interface AgreementDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: ClassAgreement | null;
  schoolProfile: SchoolProfile;
}

export const AgreementDocumentPreviewModal: React.FC<AgreementDocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  agreement,
  schoolProfile,
}) => {
  if (!isOpen || !agreement) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="my-6 w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Action Bar (Hidden on print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </button>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-bold text-teal-400">
              Pratinjau Dokumen Cetak A4: {agreement.agreementNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={handlePrint}
              title="Gunakan opsi Simpan sebagai PDF di menu cetak browser"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <FileDown className="h-4 w-4" />
              <span>Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable A4 preview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div className="print-container w-full max-w-3xl bg-white p-8 sm:p-12 shadow-md rounded-xl border border-slate-200 text-slate-900">
            {/* School Letterhead (Kop Surat) */}
            <div className="text-center pb-4 border-b-2 border-slate-900 relative">
              <div className="uppercase tracking-wider text-xs font-bold text-slate-700">
                PEMERINTAH DAERAH PROVINSI • DINAS PENDIDIKAN
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-950 mt-1">
                {schoolProfile.name}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                NPSN: {schoolProfile.npsn} • {schoolProfile.address}, {schoolProfile.city}
              </p>
              <p className="text-[11px] text-slate-500">
                Telp: {schoolProfile.phone} • Pos-el: {schoolProfile.email}
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center my-6 space-y-1">
              <h2 className="text-base sm:text-lg font-bold uppercase underline tracking-wide text-slate-950">
                PIAGAM KESEPAKATAN BELAJAR & BUDAYA POSITIF
              </h2>
              <p className="text-xs font-mono text-slate-600">Nomor: {agreement.agreementNumber}</p>
              <p className="text-xs text-slate-500">
                Tahun Ajaran {agreement.academicYear} • Semester {agreement.semester}
              </p>
            </div>

            {/* Meta info table */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
              <div>
                <span className="text-slate-500">Rombongan Belajar:</span>{' '}
                <strong className="text-slate-900">{agreement.className}</strong>
              </div>
              <div>
                <span className="text-slate-500">Tanggal Penyusunan:</span>{' '}
                <strong className="text-slate-900">{formatDateIndo(agreement.establishedDate)}</strong>
              </div>
              <div>
                <span className="text-slate-500">Wali Kelas:</span>{' '}
                <strong className="text-slate-900">{agreement.homeroomTeacherName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Agenda Evaluasi Berkala:</span>{' '}
                <strong className="text-slate-900">{formatDateIndo(agreement.reviewDate)}</strong>
              </div>
            </div>

            {/* Section 1: Tujuan & Visi */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase">
                  I. Tujuan & Komitmen Bersama
                </h3>
                <p className="text-slate-700 italic bg-teal-50/50 p-2.5 rounded border border-teal-100">
                  "{agreement.objectives}"
                </p>
              </div>

              {/* Section 2: Norma Positif */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase">
                  II. Kesepakatan & Nilai Kebajikan Positif
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                  {agreement.positiveRules.map((rule, idx) => (
                    <li key={idx} className="pl-1">
                      {rule}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Section 3: Tanggung Jawab Bersama */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase">
                  III. Peran & Tanggung Jawab Bersama
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded border border-slate-200 p-2.5 bg-slate-50/60">
                    <h4 className="font-bold text-slate-800 mb-1.5">Tanggung Jawab Pendidik:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {agreement.teacherResponsibilities.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border border-slate-200 p-2.5 bg-slate-50/60">
                    <h4 className="font-bold text-slate-800 mb-1.5">Tanggung Jawab Peserta Didik:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {agreement.studentResponsibilities.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 4: Konsekuensi Edukatif */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase">
                  IV. Konsekuensi Edukatif & Langkah Restorasi
                </h3>
                <p className="text-[11px] text-slate-500 mb-1.5 italic">
                  Bila terjadi ketidaksesuaian tindakan, penyelesaian berorientasi pada pemulihan hubungan
                  dan tanggung jawab bermakna:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                  {agreement.educationalConsequences.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Section 5: Evaluasi */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-1 uppercase">
                  V. Cara & Waktu Evaluasi
                </h3>
                <p className="text-slate-700">{agreement.evaluationMethod}</p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-10 pt-4 border-t border-slate-300">
              <p className="text-xs text-right text-slate-600 mb-4">
                Ditetapkan di {schoolProfile.city}, {formatDateIndo(agreement.establishedDate)}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <p className="text-slate-600">Perwakilan Peserta Didik,</p>
                  <p className="text-[10px] text-slate-400">Ketua Kelas</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-900 underline">
                    {agreement.studentRepresentativeName}
                  </div>
                </div>

                <div>
                  <p className="text-slate-600">Pendidik / Pembimbing,</p>
                  <p className="text-[10px] text-slate-400">Wali Kelas</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-900 underline">
                    {agreement.homeroomTeacherName}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="text-[10px] text-slate-400">Kepala Sekolah</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-900 underline">
                    {schoolProfile.headmasterName}
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">
                    NIP. {schoolProfile.headmasterNip}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="mt-8 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Arsip Resmi Ruang Kelas • Hak Cipta Sekolah</span>
              <span>Dokumen Sah Penguatan Karakter Profil Pelajar</span>
            </div>
          </div>
        </div>

        {/* Footer info in modal */}
        <div className="no-print px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span>Format cetak terstandarisasi untuk dokumen A4 dan ekspor PDF browser.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
