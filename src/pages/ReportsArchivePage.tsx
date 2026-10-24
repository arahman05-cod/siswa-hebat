import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  FileDown,
  Eye,
  ScrollText,
  FileSpreadsheet,
  HeartHandshake,
  Calendar,
  Lock,
  Building2,
  CheckCircle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsArchivePage: React.FC = () => {
  const { schoolProfile, classAgreements, incidentRecords, caseHandlings, classes, followUpPlans } =
    useApp();

  const [selectedReportType, setSelectedReportType] = useState<
    'kesepakatan' | 'catatan_kejadian' | 'penanganan_kasus' | 'rekap_evaluasi'
  >('kesepakatan');

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-xi-ak');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  // Find target item
  const selectedAgreement = classAgreements.find((a) => a.classId === selectedClassId);
  const selectedIncident = incidentRecords[0];
  const selectedCase = caseHandlings[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pusat Laporan, Dokumen & Arsip Cetak</h2>
          <p className="text-xs text-slate-500">
            Pembuatan dokumen formal A4 terstandarisasi untuk arsip sekolah dengan pengamanan kerahasiaan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Buka Pratinjau Dokumen</span>
          </button>
        </div>
      </div>

      {/* Select Document Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type A */}
        <button
          onClick={() => setSelectedReportType('kesepakatan')}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            selectedReportType === 'kesepakatan'
              ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="rounded-xl bg-teal-600 p-2 text-white mb-3">
            <ScrollText className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">A. Piagam Kesepakatan Kelas</span>
          <p className="text-[11px] text-slate-500 mt-1">
            Naskah kesepakatan belajar, aturan positif, dan tanda tangan perwakilan kelas.
          </p>
        </button>

        {/* Type B */}
        <button
          onClick={() => setSelectedReportType('catatan_kejadian')}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            selectedReportType === 'catatan_kejadian'
              ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="rounded-xl bg-amber-600 p-2 text-white mb-3">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">B. Formulir Catatan Kejadian</span>
          <p className="text-[11px] text-slate-500 mt-1">
            Uraian faktual terpisah dari keterangan siswa dan tindakan awal pendampingan.
          </p>
        </button>

        {/* Type C */}
        <button
          onClick={() => setSelectedReportType('penanganan_kasus')}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            selectedReportType === 'penanganan_kasus'
              ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="rounded-xl bg-indigo-600 p-2 text-white mb-3">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">C. Laporan Penanganan Kasus</span>
            <Lock className="h-3 w-3 text-rose-600" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Berkas bimbingan konseling dan resolusi restitusi (Watermark RAHASIA — TERBATAS).
          </p>
        </button>

        {/* Type D */}
        <button
          onClick={() => setSelectedReportType('rekap_evaluasi')}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
            selectedReportType === 'rekap_evaluasi'
              ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="rounded-xl bg-emerald-600 p-2 text-white mb-3">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">D. Rekapitulasi RTL & Evaluasi</span>
          <p className="text-[11px] text-slate-500 mt-1">
            Laporan ringkasan berkala progres budaya positif untuk evaluasi mutu sekolah.
          </p>
        </button>
      </div>

      {/* Configuration Box for Print */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Pengaturan Filter & Target Cetak</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Rombongan Belajar (Kelas):</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} • {cls.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kop Surat / Identitas:</label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 font-semibold truncate">
              {schoolProfile.name}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Format Lembar Dokumen:</label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 font-semibold">
              Kertas A4 Potret (Standar ISO 216)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <CheckCircle className="h-4 w-4 text-teal-600" />
            <span>
              Nama file PDF yang dihasilkan aman tanpa mencantumkan identitas pribadi siswa di URL.
            </span>
          </div>

          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Eye className="h-4 w-4" />
            <span>Lihat Pratinjau Dokumen Ini</span>
          </button>
        </div>
      </div>

      {/* Modal / Overlay: Fullscreen Printable A4 Document Preview */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="my-6 w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Top Toolbar (Hidden on print) */}
            <div className="no-print flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-teal-400 uppercase tracking-wider">
                  Pratinjau Resmi Siap Cetak (A4)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                >
                  <Printer className="h-4 w-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
              <div className="print-container w-full max-w-3xl bg-white p-8 sm:p-12 shadow-md rounded-xl border border-slate-200 text-slate-900 relative">
                {/* Confidentiality Watermark for Case Reports */}
                {selectedReportType === 'penanganan_kasus' && (
                  <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-2 text-center text-xs font-extrabold text-rose-800 uppercase tracking-widest">
                    RAHASIA — TERBATAS • DOKUMEN KHUSUS PETUGAS BERWENANG
                  </div>
                )}

                {/* School Letterhead */}
                <div className="text-center pb-4 border-b-2 border-slate-900">
                  <div className="uppercase tracking-wider text-[11px] font-bold text-slate-600">
                    PEMERINTAH DAERAH PROVINSI • DINAS PENDIDIKAN
                  </div>
                  <h1 className="text-lg font-extrabold uppercase tracking-tight text-slate-950 mt-1">
                    {schoolProfile.name}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    {schoolProfile.address}, {schoolProfile.city} • NPSN: {schoolProfile.npsn}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pos-el: {schoolProfile.email} • Telp: {schoolProfile.phone}
                  </p>
                </div>

                {/* Document Body According to Type */}
                {selectedReportType === 'kesepakatan' && selectedAgreement && (
                  <div className="mt-6 space-y-4 text-xs">
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-bold uppercase underline">
                        PIAGAM KESEPAKATAN BELAJAR KELAS
                      </h2>
                      <p className="font-mono text-slate-500">
                        Nomor: {selectedAgreement.agreementNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <div>
                        Kelas: <strong>{selectedAgreement.className}</strong>
                      </div>
                      <div>
                        Wali Kelas: <strong>{selectedAgreement.homeroomTeacherName}</strong>
                      </div>
                      <div>
                        Tanggal: <strong>{formatDateIndo(selectedAgreement.establishedDate)}</strong>
                      </div>
                      <div>
                        Peserta Terlibat: <strong>{selectedAgreement.participantsCount} Siswa</strong>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-2">
                        I. Visi & Tujuan Bersama
                      </h4>
                      <p className="italic text-slate-700 bg-teal-50/50 p-2.5 rounded border border-teal-100">
                        "{selectedAgreement.objectives}"
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-2">
                        II. Kesepakatan Nilai Kebajikan Positif
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                        {selectedAgreement.positiveRules.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-2">
                        III. Konsekuensi Edukatif & Pemulihan
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-800">
                        {selectedAgreement.educationalConsequences.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedReportType === 'catatan_kejadian' && selectedIncident && (
                  <div className="mt-6 space-y-4 text-xs">
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-bold uppercase underline">
                        FORMULIR CATATAN KEJADIAN FAKTUAL
                      </h2>
                      <p className="font-mono text-slate-500">
                        Nomor Arsip: {selectedIncident.recordNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        Peserta Didik: <strong>{selectedIncident.studentName}</strong>
                      </div>
                      <div>
                        Kelas: <strong>{selectedIncident.className}</strong>
                      </div>
                      <div>
                        Waktu & Lokasi: <strong>{selectedIncident.date}, {selectedIncident.time} ({selectedIncident.location})</strong>
                      </div>
                      <div>
                        Pencatat: <strong>{selectedIncident.recorderName}</strong>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        1. Uraian Faktual Teramati
                      </h4>
                      <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                        {selectedIncident.factualObservation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        2. Keterangan & Sudut Pandang Siswa
                      </h4>
                      <p className="text-slate-800 italic bg-teal-50/50 p-2.5 rounded border border-teal-100">
                        "{selectedIncident.studentPerspective}"
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        3. Tindakan Awal di Lokasi
                      </h4>
                      <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                        {selectedIncident.initialActionTaken}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReportType === 'penanganan_kasus' && selectedCase && (
                  <div className="mt-6 space-y-4 text-xs">
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-bold uppercase underline">
                        BERKAS PENDAMPINGAN RESTORATIF SISWA
                      </h2>
                      <p className="font-mono text-slate-500">
                        Nomor Berkas: {selectedCase.caseNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        Siswa Didampingi: <strong>{selectedCase.studentName}</strong> ({selectedCase.className})
                      </div>
                      <div>
                        Konselor Penanggung Jawab: <strong>{selectedCase.assignedOfficerName}</strong>
                      </div>
                      <div>
                        Target Evaluasi: <strong>{selectedCase.targetEvaluationDate}</strong>
                      </div>
                      <div>
                        Status Penanganan: <strong>{selectedCase.status.toUpperCase()}</strong>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        Hasil Pembahasan & Dialog Restitusi
                      </h4>
                      <p className="text-slate-800">{selectedCase.discussionSummary}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        Target Perbaikan Positif
                      </h4>
                      <p className="text-slate-800 italic bg-teal-50 p-2.5 rounded border border-teal-100">
                        "{selectedCase.improvementTarget}"
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm uppercase border-b pb-1 mb-1">
                        Catatan Sesi Perkembangan
                      </h4>
                      <div className="space-y-2">
                        {selectedCase.progressNotes.map((pn, i) => (
                          <div key={i} className="border-l-2 border-teal-500 pl-3 py-1">
                            <span className="font-bold text-slate-700">
                              {pn.date} ({pn.officerName}):
                            </span>{' '}
                            {pn.note}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReportType === 'rekap_evaluasi' && (
                  <div className="mt-6 space-y-4 text-xs">
                    <div className="text-center space-y-1">
                      <h2 className="text-base font-bold uppercase underline">
                        REKAPITULASI PROGRAM PENDAMPINGAN & BUDAYA POSITIF
                      </h2>
                      <p className="text-slate-500">
                        Tahun Ajaran {schoolProfile.academicYear} • Semester {schoolProfile.semester}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900">
                            <th className="border border-slate-300 p-2 text-left">No.</th>
                            <th className="border border-slate-300 p-2 text-left">Rombel</th>
                            <th className="border border-slate-300 p-2 text-left">Wali Kelas</th>
                            <th className="border border-slate-300 p-2 text-center">Kesepakatan</th>
                            <th className="border border-slate-300 p-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classes.map((cls, idx) => (
                            <tr key={cls.id}>
                              <td className="border border-slate-300 p-2">{idx + 1}</td>
                              <td className="border border-slate-300 p-2 font-bold">{cls.name}</td>
                              <td className="border border-slate-300 p-2">{cls.homeroomTeacherName}</td>
                              <td className="border border-slate-300 p-2 text-center">
                                {cls.hasActiveAgreement ? 'Ada (Aktif)' : 'Belum Ada'}
                              </td>
                              <td className="border border-slate-300 p-2 text-center">
                                Terverifikasi
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Formal Signatures Block */}
                <div className="mt-12 pt-6 border-t border-slate-300 text-xs">
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <p className="text-slate-600">Petugas / Pendidik,</p>
                      <div className="h-16 flex items-end justify-center font-bold text-slate-900 underline">
                        Ahmad Rahman, S.Kom.
                      </div>
                      <p className="text-[10px] text-slate-500">NIP. 19850615 201001 1 018</p>
                    </div>

                    <div className="text-center">
                      <p className="text-slate-600 mb-1">
                        {schoolProfile.city}, {formatDateIndo(new Date().toISOString())}
                      </p>
                      <p className="text-slate-600">Mengetahui,</p>
                      <p className="text-slate-600">Kepala Sekolah</p>
                      <div className="h-16 flex items-end justify-center font-bold text-slate-900 underline">
                        {schoolProfile.headmasterName}
                      </div>
                      <p className="text-[10px] text-slate-500">NIP. {schoolProfile.headmasterNip}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Dokumen Ruang Kelas • Dilindungi Kebijakan Kerahasiaan Sekolah</span>
                  <span>Halaman 1 dari 1</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="no-print px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Gunakan fitur "Simpan sebagai PDF" pada dialog cetak peramban.
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali ke Aplikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
