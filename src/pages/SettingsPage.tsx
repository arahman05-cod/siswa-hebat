import React, { useState } from 'react';
import {
  Settings2,
  Building2,
  Calendar,
  Shield,
  Database,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info,
  Save,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Code2,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, testSpreadsheetConnection, syncAllToSpreadsheet, resetToDefaultData } = useApp();

  const [name, setName] = useState(schoolProfile.name);
  const [npsn, setNpsn] = useState(schoolProfile.npsn);
  const [address, setAddress] = useState(schoolProfile.address);
  const [city, setCity] = useState(schoolProfile.city);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [email, setEmail] = useState(schoolProfile.email);
  const [headmasterName, setHeadmasterName] = useState(schoolProfile.headmasterName);
  const [headmasterNip, setHeadmasterNip] = useState(schoolProfile.headmasterNip);
  const [academicYear, setAcademicYear] = useState(schoolProfile.academicYear);
  const [semester, setSemester] = useState(schoolProfile.semester);
  const [dataRetentionPeriodYears, setDataRetentionPeriodYears] = useState(
    schoolProfile.dataRetentionPeriodYears
  );

  // Google Spreadsheet Integration State
  const [spreadsheetId, setSpreadsheetId] = useState(
    schoolProfile.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M'
  );
  const [spreadsheetWebhookUrl, setSpreadsheetWebhookUrl] = useState(
    schoolProfile.spreadsheetWebhookUrl || ''
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isSyncingSpreadsheet, setIsSyncingSpreadsheet] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  const appsScriptCode = `// KODE GOOGLE APPS SCRIPT (Pasang di Google Spreadsheet: Ekstensi > Apps Script)
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Uji Koneksi
    if (contents.action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Koneksi Berhasil! Google Spreadsheet siap menerima data dari Ruang Kelas SMK Fania.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Sinkronkan Seluruh Data (Data Kelas, Kesepakatan, Kejadian, Kasus, RTL, Audit)
    if (contents.action === 'sync_all' && contents.tables) {
      for (var sheetName in contents.tables) {
        var rows = contents.tables[sheetName];
        var sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
        }
        sheet.clearContents();
        if (rows && rows.length > 0) {
          var headers = Object.keys(rows[0]);
          var data = [headers];
          rows.forEach(function(item) {
            data.push(headers.map(function(h) {
              var val = item[h];
              if (Array.isArray(val)) return val.join('; ');
              if (typeof val === 'object' && val !== null) return JSON.stringify(val);
              return val !== undefined && val !== null ? val : '';
            }));
          });
          sheet.getRange(1, 1, data.length, headers.length).setValues(data);
          sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E6FFFA');
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Semua lembar kerja (sheets) berhasil disinkronkan!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Sinkronkan Lembar Kerja Spesifik (misal: Data_Kelas)
    if (contents.action === 'sync_table' && contents.sheetName && contents.rows) {
      var sheet = ss.getSheetByName(contents.sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(contents.sheetName);
      }
      sheet.clearContents();
      if (contents.rows.length > 0) {
        var headers = Object.keys(contents.rows[0]);
        var data = [headers];
        contents.rows.forEach(function(item) {
          data.push(headers.map(function(h) {
            var val = item[h];
            if (Array.isArray(val)) return val.join('; ');
            if (typeof val === 'object' && val !== null) return JSON.stringify(val);
            return val !== undefined && val !== null ? val : '';
          }));
        });
        sheet.getRange(1, 1, data.length, headers.length).setValues(data);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E6FFFA');
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Lembar kerja ' + contents.sheetName + ' berhasil disinkronkan (' + contents.rows.length + ' data).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Tambah Baris Baru Otomatis (misal saat Tambah Kelas)
    if (contents.action === 'append' && contents.sheetName && contents.row) {
      var sheet = ss.getSheetByName(contents.sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(contents.sheetName);
        var headers = Object.keys(contents.row);
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E6FFFA');
      }
      var rowData = Object.values(contents.row).map(function(v) {
        if (Array.isArray(v)) return v.join('; ');
        if (typeof v === 'object' && v !== null) return JSON.stringify(v);
        return v !== undefined && v !== null ? v : '';
      });
      sheet.appendRow(rowData);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Baris data baru berhasil ditambahkan ke ' + contents.sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Aksi tidak dikenali.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!spreadsheetWebhookUrl.trim()) {
      setWebhookMessage({ type: 'error', text: 'Masukkan URL Webhook Google Apps Script terlebih dahulu.' });
      return;
    }
    setIsTestingWebhook(true);
    setWebhookMessage(null);
    try {
      const res = await testSpreadsheetConnection(spreadsheetWebhookUrl.trim(), spreadsheetId.trim());
      setWebhookMessage({
        type: 'success',
        text: res.result?.message || 'Uji koneksi berhasil! Spreadsheet merespons dengan benar.',
      });
      await updateSchoolProfile({ spreadsheetId, spreadsheetWebhookUrl });
    } catch (err: any) {
      setWebhookMessage({ type: 'error', text: err.message || 'Gagal terhubung ke Webhook Apps Script.' });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSyncAll = async () => {
    if (!spreadsheetWebhookUrl.trim()) {
      setWebhookMessage({ type: 'error', text: 'Masukkan URL Webhook Google Apps Script terlebih dahulu.' });
      return;
    }
    setIsSyncingSpreadsheet(true);
    setWebhookMessage(null);
    try {
      const res = await syncAllToSpreadsheet(spreadsheetWebhookUrl.trim(), spreadsheetId.trim());
      setWebhookMessage({
        type: 'success',
        text: res.result?.message || 'Semua data operasional berhasil disinkronkan ke Google Spreadsheet!',
      });
      await updateSchoolProfile({ spreadsheetId, spreadsheetWebhookUrl });
    } catch (err: any) {
      setWebhookMessage({ type: 'error', text: err.message || 'Gagal sinkronisasi ke Spreadsheet.' });
    } finally {
      setIsSyncingSpreadsheet(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      name,
      npsn,
      address,
      city,
      phone,
      email,
      headmasterName,
      headmasterNip,
      academicYear,
      semester,
      dataRetentionPeriodYears,
      spreadsheetId,
      spreadsheetWebhookUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengaturan Sistem & Kebijakan Lembaga</h2>
          <p className="text-xs text-slate-500">
            Konfigurasi profil sekolah, tahun ajaran aktif, kebijakan retensi data, dan arsitektur penyimpanan
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 border border-teal-200">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span>Pengaturan Berhasil Disimpan</span>
          </div>
        )}
      </div>

      {/* Form: School Profile */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="h-5 w-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">Profil Satuan Pendidikan & Kop Resmi</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Nama Resmi Sekolah *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">NPSN Sekolah *</label>
            <input
              type="text"
              required
              value={npsn}
              onChange={(e) => setNpsn(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Dinas *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pos-el (Email) Resmi *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah *</label>
            <input
              type="text"
              required
              value={headmasterName}
              onChange={(e) => setHeadmasterName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah *</label>
            <input
              type="text"
              required
              value={headmasterNip}
              onChange={(e) => setHeadmasterNip(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran *</label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026/2027"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Semester *</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Retention & Privacy Policy Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Kebijakan Retensi & Perlindungan Informasi Siswa
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Masa Retensi Arsip Kasus (Tahun) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={dataRetentionPeriodYears}
                onChange={(e) => setDataRetentionPeriodYears(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Catatan otomatis diarsipkan secara aman setelah masa studi siswa tuntas.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Versi Prosedur Kerahasiaan
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 font-mono text-slate-600">
                {schoolProfile.confidentialityPolicyVersion} (Sesuai Permendikbudristek Pencegahan & Penanganan Kekerasan)
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Google Spreadsheet Integration Card */}
      <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Integrasi Otomatis Google Spreadsheet
              </h3>
              <p className="text-[11px] text-slate-500">
                Hubungkan Spreadsheet ID <code className="font-mono font-bold text-teal-700 bg-teal-50 px-1 py-0.5 rounded">{spreadsheetId}</code> untuk pencatatan otomatis
              </p>
            </div>
          </div>

          <a
            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors"
          >
            <span>Buka Google Spreadsheet</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>

        {/* Input Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Spreadsheet ID *
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="Contoh: 1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M"
              className="w-full rounded-xl border border-slate-300 p-2 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Diambil dari link URL lembar kerja Anda di Google Sheets.
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              URL Web App Google Apps Script (Webhook)
            </label>
            <input
              type="url"
              value={spreadsheetWebhookUrl}
              onChange={(e) => setSpreadsheetWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full rounded-xl border border-slate-300 p-2 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Didapatkan setelah menerapkan (Deploy) Apps Script sebagai Web App.
            </span>
          </div>
        </div>

        {/* Action Buttons & Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={isTestingWebhook || isSyncingSpreadsheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3.5 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-100 disabled:opacity-50 transition-colors"
            >
              <Zap className={`h-4 w-4 text-teal-600 ${isTestingWebhook ? 'animate-pulse' : ''}`} />
              <span>{isTestingWebhook ? 'Menguji Koneksi...' : 'Uji Koneksi Webhook'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isTestingWebhook || isSyncingSpreadsheet}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncingSpreadsheet ? 'animate-spin' : ''}`} />
              <span>{isSyncingSpreadsheet ? 'Menyinkronkan Data...' : 'Sinkronkan Semua Data Sekarang'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScriptGuide(!showScriptGuide)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Code2 className="h-4 w-4 text-slate-500" />
              <span>Panduan Pasang Script (3 Langkah)</span>
              {showScriptGuide ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          </div>

          {spreadsheetWebhookUrl ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Webhook Terkonfigurasi</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
              <Info className="h-3.5 w-3.5 text-amber-600" />
              <span>Menunggu URL Webhook</span>
            </span>
          )}
        </div>

        {/* Status / Alert Message */}
        {webhookMessage && (
          <div
            className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              webhookMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {webhookMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{webhookMessage.text}</span>
          </div>
        )}

        {/* Collapsible 3-Step Guide */}
        {showScriptGuide && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900">
                Cara Menghubungkan ke Google Spreadsheet Anda:
              </h4>
              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-500 transition-colors"
              >
                {copiedScript ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedScript ? 'Kode Berhasil Disalin!' : 'Salin Kode Apps Script'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed">
              <li>
                Buka Spreadsheet Anda (<a href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline font-semibold">klik di sini untuk membuka</a>), lalu klik menu <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.
              </li>
              <li>
                Hapus teks default yang ada di dalam editor (misal <code>function myFunction() &#123;&#125;</code>), lalu <strong>Tempel / Paste</strong> kode yang sudah disalin di atas.
              </li>
              <li>
                Klik tombol biru <strong>Terapkan (Deploy) &gt; Penerapan Baru (New deployment)</strong> di pojok kanan atas:
                <ul className="list-disc list-inside ml-4 mt-1 text-slate-600 space-y-1">
                  <li>Pilih jenis (roda gigi): <strong>Aplikasi Web (Web app)</strong></li>
                  <li>Jalankan sebagai: <strong>Saya (email akun Anda)</strong></li>
                  <li>Siapa yang memiliki akses: <strong>Siapa saja (Anyone)</strong></li>
                  <li>Klik <strong>Terapkan (Deploy)</strong> dan salin <strong>URL Aplikasi Web</strong> yang dihasilkan ke kolom input di atas.</li>
                </ul>
              </li>
            </ol>

            <div className="rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-teal-300 max-h-48 overflow-y-auto">
              <pre>{appsScriptCode}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Storage Architecture - Server Database */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Arsitektur Database & Penyimpanan Permanen Server
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seluruh data operasional sekolah disimpan secara permanen dan terisolasi pada backend server sekolah (REST API dengan enkripsi sesi dan audit log terpusat):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {[
            { name: 'Kesepakatan_Kelas', desc: 'Arsip norma & aturan' },
            { name: 'Catatan_Kejadian', desc: 'Jurnal fakta objektif' },
            { name: 'Penanganan_Kasus', desc: 'Pendampingan & konseling' },
            { name: 'Tindak_Lanjut', desc: 'Agenda evaluasi RTL' },
            { name: 'Pengguna', desc: 'Data akun & peran terverifikasi' },
            { name: 'Audit_Log', desc: 'Jejak audit non-sensitif' },
          ].map((sheet, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="font-mono font-bold text-slate-800 text-[11px] block truncate">
                {sheet.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">{sheet.desc}</span>
            </div>
          ))}
        </div>

        {/* Security & Isolation Advantage */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-xs text-teal-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-teal-950">
            <Shield className="h-4 w-4 text-teal-700" />
            <span>Kerahasiaan & Perlindungan Data Siswa:</span>
          </div>
          <p className="text-[11px] text-teal-800 leading-relaxed">
            Data kasus dan catatan pendampingan siswa disimpan secara aman di backend server internal tanpa dibagikan ke layanan spreadsheet pihak ketiga publik. Akses dibatasi ketat berdasarkan otorisasi peran (Administrator, Wali Kelas, Petugas BK, dan Pimpinan Sekolah) dengan jejak audit otomatis.
          </p>
        </div>
      </div>

      {/* Demo & Test Data Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 text-xs">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Pemisahan Data Operasional & Data Simulasi Pengujian</h4>
          <p className="text-slate-500 mt-1">
            Data operasional sekolah disimpan secara permanen di database server. Jika Anda ingin melakukan pengujian fitur, Anda dapat memuat data simulasi yang diberi label khusus <strong>[DEMO]</strong> atau membersihkannya kapan saja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={async () => {
              try {
                await useApp().seedDemoData();
                alert('Data simulasi dengan label [DEMO] berhasil dimuat.');
              } catch (err: any) {
                alert(err.message || 'Gagal memuat data demo.');
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-4 py-2 font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-teal-600" />
            <span>Muat Data Pengujian (Label DEMO)</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Bersihkan seluruh data yang berlabel DEMO? Hanya data operasional riil yang akan dipertahankan.')) {
                try {
                  await useApp().clearDemoData();
                  alert('Seluruh data bertanda DEMO berhasil dibersihkan.');
                } catch (err: any) {
                  alert(err.message || 'Gagal membersihkan data demo.');
                }
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2 font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span>Bersihkan Data Uji DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
