import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  ScrollText,
  DoorClosed,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  FilePlus,
  Shield,
  X,
  Phone,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Link2,
  Download,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassData, Student } from '../types';
import { ClassModal } from '../components/modals/ClassModal';

interface ClassDataPageProps {
  onOpenNewAgreement: (classId?: string) => void;
  onViewAgreement: (agreementId: string) => void;
}

export const ClassDataPage: React.FC<ClassDataPageProps> = ({
  onOpenNewAgreement,
  onViewAgreement,
}) => {
  const {
    classes,
    students,
    classAgreements,
    currentUser,
    schoolProfile,
    updateSchoolProfile,
    syncClassesToSpreadsheet,
    testSpreadsheetConnection,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    deleteStudent,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'X' | 'XI' | 'XII'>('all');
  const [viewingClassStudents, setViewingClassStudents] = useState<ClassData | null>(null);

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassData | null>(null);

  // Spreadsheet Sync States
  const [isSyncingSpreadsheet, setIsSyncingSpreadsheet] = useState(false);
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(schoolProfile.spreadsheetWebhookUrl || '');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Student Form inside roster modal
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');

  // Status/Alert message
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.homeroomTeacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const classStudents = viewingClassStudents
    ? students.filter((s) => s.classId === viewingClassStudents.id)
    : [];

  // Delete Confirmation Modal
  const [classToDelete, setClassToDelete] = useState<{
    cls: ClassData;
    studentCount: number;
    hasAgreements: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAddClass = () => {
    setClassToEdit(null);
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: ClassData) => {
    setClassToEdit(cls);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async (classData: {
    name: string;
    grade: 'X' | 'XI' | 'XII';
    department: string;
    room: string;
    homeroomTeacherName: string;
    homeroomTeacherNip: string;
  }) => {
    if (classToEdit) {
      await updateClass(classToEdit.id, classData);
      showFeedback('success', `Rombel "${classData.name}" berhasil diperbarui & disinkronkan.`);
    } else {
      const res: any = await addClass(classData);
      if (res?.spreadsheetSync?.success) {
        showFeedback(
          'success',
          `Rombel "${classData.name}" berhasil ditambahkan & otomatis tersimpan ke Google Spreadsheet (Sheet: Data_Kelas).`
        );
      } else if (res?.spreadsheetSync?.message && !schoolProfile?.spreadsheetWebhookUrl) {
        showFeedback(
          'success',
          `Rombel "${classData.name}" berhasil ditambahkan ke database. Hubungkan Webhook Spreadsheet agar otomatis tersimpan di Google Sheets.`
        );
      } else {
        showFeedback('success', `Rombel "${classData.name}" berhasil ditambahkan.`);
      }
    }
  };

  const handleManualSyncClasses = async () => {
    if (!schoolProfile.spreadsheetWebhookUrl) {
      setTempWebhookUrl(schoolProfile.spreadsheetWebhookUrl || '');
      setIsSpreadsheetModalOpen(true);
      return;
    }
    setIsSyncingSpreadsheet(true);
    try {
      const res = await syncClassesToSpreadsheet();
      showFeedback(
        'success',
        `Berhasil! Seluruh ${classes.length} rombel tersimpan & tersinkronkan ke Google Spreadsheet (Sheet: Data_Kelas).`
      );
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal sinkronisasi data kelas ke Google Spreadsheet.');
    } finally {
      setIsSyncingSpreadsheet(false);
    }
  };

  const handleTestAndSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempWebhookUrl.trim()) {
      setWebhookTestStatus({ success: false, message: 'URL Webhook Google Apps Script wajib diisi.' });
      return;
    }
    setIsTestingWebhook(true);
    setWebhookTestStatus(null);
    try {
      await testSpreadsheetConnection(tempWebhookUrl.trim(), schoolProfile.spreadsheetId);
      await updateSchoolProfile({ spreadsheetWebhookUrl: tempWebhookUrl.trim() });
      setWebhookTestStatus({
        success: true,
        message: 'Koneksi Berhasil! Webhook aktif dan tersimpan. Siap sinkronisasi otomatis.',
      });
      showFeedback('success', 'Webhook Google Spreadsheet berhasil dihubungkan!');
    } catch (err: any) {
      setWebhookTestStatus({
        success: false,
        message: err.message || 'Gagal terhubung ke Webhook Apps Script. Pastikan Webhook telah dideploy sebagai Web App (Anyone).',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const getClassRowsForSpreadsheet = () => {
    return classes.map((c) => {
      const activeAgr = classAgreements.find((a) => a.classId === c.id && a.status === 'aktif');
      return {
        ID_Kelas: c.id,
        Nama_Kelas: c.name,
        Tingkat: c.grade,
        Jurusan: c.department,
        Tahun_Ajaran: c.academicYear || schoolProfile.academicYear || '2026/2027',
        Wali_Kelas: c.homeroomTeacherName || 'Belum Ditugaskan',
        Ruangan: c.room || 'Ruang Teori',
        Status_Kesepakatan: (c.hasActiveAgreement || !!activeAgr) ? 'Ada' : 'Belum Ada',
      };
    });
  };

  const handleCopyTsv = () => {
    const rows = getClassRowsForSpreadsheet();
    const headers = ['ID_Kelas', 'Nama_Kelas', 'Tingkat', 'Jurusan', 'Tahun_Ajaran', 'Wali_Kelas', 'Ruangan', 'Status_Kesepakatan'];
    const tsvContent = [
      headers.join('\t'),
      ...rows.map((r) => [r.ID_Kelas, r.Nama_Kelas, r.Tingkat, r.Jurusan, r.Tahun_Ajaran, r.Wali_Kelas, r.Ruangan, r.Status_Kesepakatan].join('\t')),
    ].join('\n');

    navigator.clipboard.writeText(tsvContent);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 3000);
    showFeedback('success', 'Data tabel kelas (format TSV) berhasil disalin ke clipboard! Siap di-paste ke Google Spreadsheet.');
  };

  const handleDownloadCsv = () => {
    const rows = getClassRowsForSpreadsheet();
    const headers = ['ID_Kelas', 'Nama_Kelas', 'Tingkat', 'Jurusan', 'Tahun_Ajaran', 'Wali_Kelas', 'Ruangan', 'Status_Kesepakatan'];
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => [
        `"${r.ID_Kelas}"`,
        `"${r.Nama_Kelas}"`,
        `"${r.Tingkat}"`,
        `"${r.Jurusan.replace(/"/g, '""')}"`,
        `"${r.Tahun_Ajaran}"`,
        `"${r.Wali_Kelas.replace(/"/g, '""')}"`,
        `"${r.Ruangan.replace(/"/g, '""')}"`,
        `"${r.Status_Kesepakatan}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Kelas_${schoolProfile.academicYear?.replace('/', '-') || '2026-2027'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('success', 'File CSV Data_Kelas berhasil diunduh.');
  };

  const promptDeleteClass = (cls: ClassData) => {
    const studentCount = students.filter((s) => s.classId === cls.id).length;
    const hasAgreements = classAgreements.some((a) => a.classId === cls.id);
    setClassToDelete({ cls, studentCount, hasAgreements });
  };

  const handleConfirmDeleteClass = async (force: boolean = false) => {
    if (!classToDelete) return;
    const targetClass = classToDelete.cls;
    setIsDeleting(true);
    try {
      await deleteClass(targetClass.id, force);
      showFeedback('success', `Rombongan belajar "${targetClass.name}" berhasil dihapus.`);
      if (viewingClassStudents?.id === targetClass.id) {
        setViewingClassStudents(null);
      }
      setClassToDelete(null);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menghapus rombel.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingClassStudents || !newStudentName.trim()) return;

    try {
      await addStudent({
        name: newStudentName.trim(),
        nisn: newStudentNisn.trim() || '-',
        gender: newStudentGender,
        classId: viewingClassStudents.id,
        className: viewingClassStudents.name,
        guardianName: newStudentGuardian.trim() || '-',
        guardianPhone: newStudentPhone.trim() || '-',
      });

      setNewStudentName('');
      setNewStudentNisn('');
      setNewStudentGuardian('');
      setNewStudentPhone('');
      setIsAddingStudent(false);
      showFeedback('success', 'Peserta didik berhasil didaftarkan ke rombel.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menambahkan peserta didik.');
    }
  };

  const handleDeleteStudent = async (std: Student) => {
    if (!window.confirm(`Hapus data peserta didik "${std.name}" dari rombel?`)) return;
    try {
      await deleteStudent(std.id);
      showFeedback('success', `Data siswa "${std.name}" telah dihapus.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menghapus data siswa.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-teal-50 border-teal-200 text-teal-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Rombongan Belajar (Kelas)</h2>
          <p className="text-xs text-slate-500">
            Daftar kelas aktif, program studi, perwalian guru, dan kesepakatan belajar
          </p>
        </div>

        {/* Action & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Button Tambah Kelas */}
          <button
            onClick={handleOpenAddClass}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-500 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Kelas</span>
          </button>

          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kelas, jurusan, wali..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs shrink-0">
            {(['all', 'X', 'XI', 'XII'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grade === 'all' ? 'Semua' : `Kelas ${grade}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Google Spreadsheet Integration Status & Action Card */}
      <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Integrasi Google Spreadsheet
                </h3>
                <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                  Sheet: Data_Kelas
                </span>
                {schoolProfile.spreadsheetWebhookUrl ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Otomatis Tersimpan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    <AlertCircle className="h-3 w-3" />
                    Webhook Belum Dihubungkan
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                Format kolom tersimpan:{' '}
                <span className="font-mono text-[10px] text-slate-800 bg-white/90 border border-slate-200 px-1 py-0.5 rounded">
                  ID_Kelas | Nama_Kelas | Tingkat | Jurusan | Tahun_Ajaran | Wali_Kelas | Ruangan | Status_Kesepakatan
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleManualSyncClasses}
              disabled={isSyncingSpreadsheet}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-600 disabled:opacity-60 transition-colors cursor-pointer"
              title="Kirim dan sinkronkan seluruh data kelas ke sheet Data_Kelas di Google Spreadsheet"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSpreadsheet ? 'animate-spin' : ''}`} />
              <span>{isSyncingSpreadsheet ? 'Menyinkronkan...' : 'Sinkronkan ke Spreadsheet'}</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              title="Lihat tabel dan salin langsung untuk Google Spreadsheet (TSV/CSV)"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>Format & Salin Data</span>
            </button>

            <button
              onClick={() => {
                setTempWebhookUrl(schoolProfile.spreadsheetWebhookUrl || '');
                setWebhookTestStatus(null);
                setIsSpreadsheetModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-100/60 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors cursor-pointer"
              title="Atur URL Webhook Google Apps Script"
            >
              <Link2 className="h-3.5 w-3.5 text-teal-700" />
              <span>Atur Webhook</span>
            </button>

            <a
              href={`https://docs.google.com/spreadsheets/d/${schoolProfile.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              title="Buka Google Spreadsheet langsung di tab baru"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-700">Tidak ada rombel yang sesuai</h3>
          <p className="mt-1 text-xs text-slate-500">
            Coba ubah kata kunci pencarian, filter tingkat kelas, atau tambahkan kelas baru.
          </p>
          <button
            onClick={handleOpenAddClass}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Kelas Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
          {filteredClasses.map((cls) => {
            const agreement = classAgreements.find(
              (a) => a.classId === cls.id && a.status === 'aktif'
            );

            return (
              <div
                key={cls.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-bold text-white">
                          {cls.name}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          Tingkat {cls.grade}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-slate-900">{cls.department}</h3>
                    </div>

                    <div>
                      {agreement ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Kesepakatan Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Belum Ada Kesepakatan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Program Studi:</span>
                      <span className="font-semibold text-slate-800 text-right">{cls.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Wali Kelas:</span>
                      <span className="font-semibold text-slate-800">{cls.homeroomTeacherName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">NIP Wali:</span>
                      <span className="font-mono text-slate-700">{cls.homeroomTeacherNip}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Ruang Belajar / Lab:</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <DoorClosed className="h-3.5 w-3.5 text-slate-400" />
                        {cls.room}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Jumlah Peserta Didik:</span>
                      <span className="flex items-center gap-1 font-bold text-teal-800">
                        <Users className="h-3.5 w-3.5 text-teal-600" />
                        {cls.totalStudents} Siswa Terdaftar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* Button Aksi: Edit & Delete */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-0.5 uppercase tracking-wider">
                      Aksi:
                    </span>
                    <button
                      onClick={() => handleOpenEditClass(cls)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 hover:text-teal-700 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                      title={`Edit data rombel ${cls.name}`}
                    >
                      <Edit2 className="h-3.5 w-3.5 text-teal-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => promptDeleteClass(cls)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition-colors shadow-2xs cursor-pointer"
                      title={`Hapus rombel ${cls.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Rombel Siswa & Kesepakatan */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingClassStudents(cls)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>Siswa ({cls.totalStudents})</span>
                    </button>

                    {agreement ? (
                      <button
                        onClick={() => onViewAgreement(agreement.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Kesepakatan</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenNewAgreement(cls.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors cursor-pointer"
                      >
                        <FilePlus className="h-3.5 w-3.5" />
                        <span>Kesepakatan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Rombel "{classToDelete.cls.name}"?
                </h3>
                <p className="text-xs text-slate-500">
                  Tingkat {classToDelete.cls.grade} • {classToDelete.cls.department}
                </p>
              </div>
            </div>

            {classToDelete.studentCount > 0 || classToDelete.hasAgreements ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Peringatan Data Terkait</span>
                </div>
                <p>
                  Rombel ini memiliki{' '}
                  <strong className="text-amber-950 font-bold">
                    {classToDelete.studentCount} siswa terdaftar
                  </strong>
                  {classToDelete.hasAgreements && ' dan dokumen kesepakatan kelas'}.
                </p>
                <p className="text-[11px] text-amber-700">
                  Apakah Anda ingin menghapus rombel ini beserta data siswa di dalamnya?
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Tindakan ini akan menghapus data rombel secara permanen dari basis data sistem sekolah.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  handleConfirmDeleteClass(
                    classToDelete.studentCount > 0 || classToDelete.hasAgreements
                  )
                }
                disabled={isDeleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-60 transition-colors cursor-pointer shadow-xs"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Rombel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Class Student Roster */}
      {viewingClassStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Peserta Didik — {viewingClassStudents.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Wali Kelas: {viewingClassStudents.homeroomTeacherName} • {classStudents.length} Siswa Terdaftar
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingStudent(!isAddingStudent)}
                  className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500 transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{isAddingStudent ? 'Batal Tambah' : '+ Tambah Siswa'}</span>
                </button>
                <button
                  onClick={() => {
                    setViewingClassStudents(null);
                    setIsAddingStudent(false);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {/* Add Student Sub-form */}
              {isAddingStudent && (
                <form
                  onSubmit={handleCreateStudent}
                  className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-3 text-xs"
                >
                  <h4 className="font-bold text-slate-900">Pendaftaran Peserta Didik Baru ke {viewingClassStudents.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Contoh: Ahmad Faiz"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NISN</label>
                      <input
                        type="text"
                        value={newStudentNisn}
                        onChange={(e) => setNewStudentNisn(e.target.value)}
                        placeholder="0081234567"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        value={newStudentGender}
                        onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold"
                      >
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={newStudentGuardian}
                        onChange={(e) => setNewStudentGuardian(e.target.value)}
                        placeholder="Nama wali murid"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">No. Kontak / Telepon Wali</label>
                      <input
                        type="text"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStudent(false)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-500"
                    >
                      Simpan Siswa
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-xs text-teal-800">
                <Shield className="h-4 w-4 shrink-0 text-teal-600" />
                <span>
                  Data peserta didik disimpan permanen di server sekolah untuk keperluan perwalian dan kesepakatan bersama.
                </span>
              </div>

              {classStudents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada peserta didik terdaftar pada rombel ini. Gunakan tombol "+ Tambah Siswa" di atas untuk mendaftarkan siswa.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {classStudents.map((std, idx) => (
                    <div key={std.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 w-5">{idx + 1}.</span>
                        <div>
                          <div className="font-semibold text-slate-900">{std.name}</div>
                          <div className="text-[11px] text-slate-400">
                            NISN: {std.nisn} • Gender: {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-[11px]">
                          <div className="text-slate-700 font-medium">Wali: {std.guardianName}</div>
                          <div className="flex items-center justify-end gap-1 text-slate-400">
                            <Phone className="h-3 w-3" />
                            <span>{std.guardianPhone}</span>
                          </div>
                        </div>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteStudent(std)}
                            title="Hapus Siswa"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setViewingClassStudents(null);
                  setIsAddingStudent(false);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Add/Edit Modal */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        classToEdit={classToEdit}
        onSave={handleSaveClass}
      />

      {/* Modal Format & Salin Data Spreadsheet */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Format Data Google Spreadsheet (Sheet: Data_Kelas)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Struktur 8 kolom baku untuk tabel Data Rombongan Belajar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="rounded-xl bg-teal-50 border border-teal-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-900">
                <div>
                  <p className="font-bold">
                    Kolom Tersedia ({classes.length} Rombel Terdaftar):
                  </p>
                  <p className="font-mono text-[11px] text-teal-700 mt-0.5">
                    ID_Kelas | Nama_Kelas | Tingkat | Jurusan | Tahun_Ajaran | Wali_Kelas | Ruangan | Status_Kesepakatan
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTsv}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-teal-600 cursor-pointer"
                  >
                    {copiedTsv ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedTsv ? 'Tersalin!' : 'Salin untuk Sheets (Ctrl+V)'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-3 py-1.5 font-semibold text-teal-800 hover:bg-teal-100 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Unduh CSV</span>
                  </button>
                </div>
              </div>

              {/* Table Preview */}
              <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead className="bg-slate-100/80 font-bold text-slate-900 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-2.5">ID_Kelas</th>
                      <th className="px-3 py-2.5">Nama_Kelas</th>
                      <th className="px-3 py-2.5">Tingkat</th>
                      <th className="px-3 py-2.5">Jurusan</th>
                      <th className="px-3 py-2.5">Tahun_Ajaran</th>
                      <th className="px-3 py-2.5">Wali_Kelas</th>
                      <th className="px-3 py-2.5">Ruangan</th>
                      <th className="px-3 py-2.5">Status_Kesepakatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {getClassRowsForSpreadsheet().map((row, idx) => (
                      <tr key={row.ID_Kelas || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2 font-bold text-teal-700 whitespace-nowrap">{row.ID_Kelas}</td>
                        <td className="px-3 py-2 font-bold text-slate-900 whitespace-nowrap">{row.Nama_Kelas}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.Tingkat}</td>
                        <td className="px-3 py-2 text-slate-800 font-sans">{row.Jurusan}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.Tahun_Ajaran}</td>
                        <td className="px-3 py-2 text-slate-800 font-sans">{row.Wali_Kelas}</td>
                        <td className="px-3 py-2 text-slate-600 font-sans">{row.Ruangan}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.Status_Kesepakatan === 'Ada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {row.Status_Kesepakatan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs">
              <a
                href={`https://docs.google.com/spreadsheets/d/${schoolProfile.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Buka Google Spreadsheet Target</span>
              </a>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Webhook Spreadsheet */}
      {isSpreadsheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <Link2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Hubungkan Webhook Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Otomatisasi pengiriman data saat penambahan kelas baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSpreadsheetModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTestAndSaveWebhook} className="p-6 space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                <div className="font-bold text-slate-800">Target Google Spreadsheet:</div>
                <div className="font-mono text-[11px] text-teal-700 break-all select-all bg-white p-2 rounded-lg border border-slate-200">
                  {schoolProfile.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M'}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL Webhook Google Apps Script *
                </label>
                <input
                  type="url"
                  required
                  value={tempWebhookUrl}
                  onChange={(e) => setTempWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Dapatkan dari menu Google Spreadsheet: <b>Ekstensi &gt; Apps Script &gt; Terapkan (Deploy) &gt; Deployment baru (Web App, Siapa saja)</b>
                </p>
              </div>

              {webhookTestStatus && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                    webhookTestStatus.success
                      ? 'bg-teal-50 border-teal-200 text-teal-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {webhookTestStatus.success ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  )}
                  <span>{webhookTestStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSpreadsheetModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isTestingWebhook}
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-500 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {isTestingWebhook ? 'Menguji & Menyimpan...' : 'Uji & Simpan Webhook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
