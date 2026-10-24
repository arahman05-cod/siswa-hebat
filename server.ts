import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

// Initial default operational database schema
function getInitialDbState() {
  const masterAdmin = hashPassword('2009');
  return {
    schoolProfile: {
      name: 'SMK Fania Salsabila Mandiri',
      npsn: '20108921',
      address: 'Jl. Raya Pendidikan No. 45',
      city: 'Kota Pelajar',
      postalCode: '55281',
      phone: '(0274) 582103',
      email: 'info@smkfania.sch.id',
      headmasterName: 'Dra. Hj. Siti Nurhaliza, M.Pd.',
      headmasterNip: '19710412 199603 2 003',
      academicYear: '2026/2027',
      semester: 'Ganjil',
      confidentialityPolicyVersion: 'V.2.4-2026',
      dataRetentionPeriodYears: 5,
      spreadsheetId: '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M',
      spreadsheetWebhookUrl: '',
    },
    users: [
      {
        id: 'usr-admin-1',
        username: 'smkfania',
        name: 'Administrator Resmi (SMK Fania)',
        nip: '19850101 201001 1 001',
        role: 'admin',
        roleLabel: 'Administrator Sistem & Data',
        email: 'admin@smkfania.sch.id',
        salt: masterAdmin.salt,
        passwordHash: masterAdmin.hash,
        isActive: true,
        assignedClassIds: [],
        createdAt: new Date().toISOString(),
      },
    ],
    classes: [
      { id: 'cls-x-tlm', name: 'X TLM', grade: 'X', department: 'Teknik Laboratorium Medik', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab TLM Dasar 1' },
      { id: 'cls-x-far-a', name: 'X Far-A', grade: 'X', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Farmasi Dasar 1' },
      { id: 'cls-x-far-b', name: 'X Far-B', grade: 'X', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Farmasi Dasar 2' },
      { id: 'cls-x-far-c', name: 'X Far-C', grade: 'X', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Ruang Teori 102' },
      { id: 'cls-xi-tlm', name: 'XI TLM', grade: 'XI', department: 'Teknik Laboratorium Medik', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Hematologi & TLM' },
      { id: 'cls-xi-far-a', name: 'XI FAR-A', grade: 'XI', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Resep Farmasi A' },
      { id: 'cls-xi-far-b', name: 'XI FAR-B', grade: 'XI', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Resep Farmasi B' },
      { id: 'cls-xi-far-c', name: 'XI FAR-C', grade: 'XI', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Ruang Teori 203' },
      { id: 'cls-xii-tlm', name: 'XII TLM', grade: 'XII', department: 'Teknik Laboratorium Medik', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Kimia Klinik TLM' },
      { id: 'cls-xii-far-a', name: 'XII FAR-A', grade: 'XII', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Lab Kimia Farmasi Lanjutan' },
      { id: 'cls-xii-far-b', name: 'XII FAR-B', grade: 'XII', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Ruang Simulasi Apotek' },
      { id: 'cls-xii-far-c', name: 'XII FAR-C', grade: 'XII', department: 'Farmasi Klinis dan Komunitas', academicYear: '2026/2027', homeroomTeacherId: '', homeroomTeacherName: 'Belum Ditugaskan', homeroomTeacherNip: '-', totalStudents: 0, hasActiveAgreement: false, room: 'Ruang Teori 303' },
    ],
    students: [],
    agreements: [],
    incidents: [],
    cases: [],
    plans: [],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'Sistem Ruang Kelas',
        userRole: 'System Initialization',
        action: 'Inisialisasi Database Operasional',
        resourceType: 'Database',
        resourceId: 'database.json',
        ipAddress: '127.0.0.1',
        summary: 'Database penyimpanan permanen sekolah diinisialisasi secara aman',
      },
    ],
  };
}

// Database helper with atomic write
class JsonDatabase {
  private data: any;

  constructor() {
    this.load();
  }

  private load() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = getInitialDbState();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure master user smkfania exists
        const hasAdmin = this.data.users && this.data.users.some((u: any) => u.username === 'smkfania');
        if (!hasAdmin) {
          const masterAdmin = hashPassword('2009');
          this.data.users.push({
            id: 'usr-admin-1',
            username: 'smkfania',
            name: 'Administrator Resmi (SMK Fania)',
            nip: '19850101 201001 1 001',
            role: 'admin',
            roleLabel: 'Administrator Sistem & Data',
            email: 'admin@smkfania.sch.id',
            salt: masterAdmin.salt,
            passwordHash: masterAdmin.hash,
            isActive: true,
            assignedClassIds: [],
            createdAt: new Date().toISOString(),
          });
          this.save();
        }

        // Automatic migration: Replace any remaining "AK" classes or departments with "TLM"
        if (this.data.classes && Array.isArray(this.data.classes)) {
          let migrated = false;
          this.data.classes.forEach((cls: any) => {
            if (cls.name && cls.name.includes('AK')) {
              cls.name = cls.name.replace(/\bAK\b/g, 'TLM');
              migrated = true;
            }
            if (cls.id && cls.id.includes('-ak')) {
              cls.id = cls.id.replace(/-ak/g, '-tlm');
              migrated = true;
            }
            if (cls.department && cls.department.includes('Akuntansi')) {
              cls.department = 'Teknik Laboratorium Medik';
              migrated = true;
            }
            if (cls.room && cls.room.includes('Akuntansi')) {
              cls.room = cls.room.replace('Komputer Akuntansi', 'Hematologi & TLM');
              migrated = true;
            }
          });

          // Also migrate references in students, agreements, incidents, cases
          if (this.data.students) {
            this.data.students.forEach((s: any) => {
              if (s.className && s.className.includes('AK')) {
                s.className = s.className.replace(/\bAK\b/g, 'TLM');
                migrated = true;
              }
              if (s.classId && s.classId.includes('-ak')) {
                s.classId = s.classId.replace(/-ak/g, '-tlm');
                migrated = true;
              }
            });
          }
          if (migrated) {
            this.save();
          }
        }
      } catch (err) {
        console.error('Error reading database file, resetting to initial state', err);
        this.data = getInitialDbState();
        this.save();
      }
    }
  }

  public save() {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public get() {
    return this.data;
  }
}

const db = new JsonDatabase();

// In-memory active session tokens
interface SessionUser {
  userId: string;
  username: string;
  name: string;
  role: string;
  roleLabel: string;
  assignedClassIds: string[];
}
const activeSessions = new Map<string, { user: SessionUser; expiresAt: number }>();

function createSession(user: SessionUser): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days validity
  activeSessions.set(token, {
    user,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

function getSessionUser(token: string): SessionUser | null {
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session.user;
}

// Log audit entry helper
function recordAuditLog(
  action: string,
  resourceType: string,
  resourceId: string,
  summary: string,
  req: Request
) {
  const data = db.get();
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const user = token ? getSessionUser(token) : null;

  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId: user?.userId || 'anonim',
    userName: user?.name || 'Anonim',
    userRole: user?.roleLabel || 'Tamu',
    action,
    resourceType,
    resourceId,
    ipAddress: req.ip || '127.0.0.1',
    summary,
  };

  data.auditLogs.unshift(logEntry);
  // Keep audit log within reasonable length (max 1000 entries)
  if (data.auditLogs.length > 1000) {
    data.auditLogs = data.auditLogs.slice(0, 1000);
  }
  db.save();
}

// Express App Initialization
const app = express();
app.use(express.json());

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sesi tidak ditemukan atau kedaluwarsa. Silakan masuk kembali.' });
  }

  const token = authHeader.slice(7);
  const sessionUser = getSessionUser(token);
  if (!sessionUser) {
    return res.status(401).json({ error: 'Sesi tidak sah. Silakan masuk kembali.' });
  }

  (req as any).user = sessionUser;
  next();
}

function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as SessionUser;
    if (!user || (!roles.includes(user.role) && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Akses ditolak: Anda tidak memiliki wewenang untuk tindakan ini.' });
    }
    next();
  };
}

// ======================== API ROUTES ========================

// 1. Authentication Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const data = db.get();
  const user = data.users.find(
    (u: any) => u.username.toLowerCase() === cleanUser && u.isActive !== false
  );

  if (!user) {
    return res.status(401).json({ error: 'Username atau password tidak cocok.' });
  }

  const isValid = verifyPassword(String(password), user.salt, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Username atau password tidak cocok.' });
  }

  const sessionUser: SessionUser = {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    roleLabel: user.roleLabel,
    assignedClassIds: user.assignedClassIds || [],
  };

  const token = createSession(sessionUser);
  recordAuditLog('Login Pengguna', 'AuthSession', user.id, `Pengguna ${user.name} berhasil masuk ke aplikasi`, req);

  res.json({
    token,
    user: sessionUser,
  });
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as SessionUser;
  const data = db.get();
  const liveUser = data.users.find((u: any) => u.id === user.userId);
  if (!liveUser || liveUser.isActive === false) {
    return res.status(401).json({ error: 'Akun telah dinonaktifkan atau dihapus.' });
  }

  res.json({
    userId: liveUser.id,
    username: liveUser.username,
    name: liveUser.name,
    role: liveUser.role,
    roleLabel: liveUser.roleLabel,
    assignedClassIds: liveUser.assignedClassIds || [],
  });
});

app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7) || '';
  activeSessions.delete(token);
  res.json({ success: true, message: 'Berhasil keluar.' });
});

// 2. School Profile
app.get('/api/school', requireAuth, (_req: Request, res: Response) => {
  res.json(db.get().schoolProfile);
});

app.put('/api/school', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const data = db.get();
  data.schoolProfile = { ...data.schoolProfile, ...req.body };
  db.save();
  recordAuditLog('Perbarui Profil Sekolah', 'SchoolProfile', 'config', 'Pengaturan profil satuan pendidikan diperbarui', req);
  res.json(data.schoolProfile);
});

// Format Class row to strictly match required spreadsheet schema:
// ID_Kelas | Nama_Kelas | Tingkat | Jurusan | Tahun_Ajaran | Wali_Kelas | Ruangan | Status_Kesepakatan
function formatClassRowForSpreadsheet(cls: any, agreements: any[], schoolAcademicYear?: string) {
  const activeAgr = agreements?.find((a: any) => a.classId === cls.id && a.status === 'aktif');
  return {
    ID_Kelas: cls.id,
    Nama_Kelas: cls.name,
    Tingkat: cls.grade,
    Jurusan: cls.department,
    Tahun_Ajaran: cls.academicYear || schoolAcademicYear || '2026/2027',
    Wali_Kelas: cls.homeroomTeacherName || 'Belum Ditugaskan',
    Ruangan: cls.room || 'Ruang Teori',
    Status_Kesepakatan: (cls.hasActiveAgreement || !!activeAgr) ? 'Ada' : 'Belum Ada',
  };
}

// Helper for Google Apps Script Webhook Sync
async function syncToSpreadsheetWebhook(action: string, payload: any): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const profile = db.get().schoolProfile;
    const webhookUrl = profile?.spreadsheetWebhookUrl;
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      return {
        success: false,
        message: 'URL Webhook Google Apps Script belum dikonfigurasi. Hubungkan webhook di menu Pengaturan atau form spreadsheet.',
      };
    }
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spreadsheetId: profile.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M',
        action,
        ...payload,
      }),
    });
    const result = await response.json();
    return { success: true, message: 'Data berhasil disinkronkan ke Google Spreadsheet.', details: result };
  } catch (err: any) {
    console.warn('[Spreadsheet Webhook Notice] Gagal sinkronisasi otomatis:', err);
    return { success: false, message: `Gagal sinkronisasi ke Spreadsheet: ${err.message}` };
  }
}

async function syncAllClassesToSpreadsheet() {
  const data = db.get();
  const rows = data.classes.map((c: any) => formatClassRowForSpreadsheet(c, data.agreements, data.schoolProfile?.academicYear));
  return await syncToSpreadsheetWebhook('sync_table', {
    sheetName: 'Data_Kelas',
    rows,
  });
}

// Format User row to strictly match required spreadsheet schema:
// user_id | nama_lengkap | email | peran | class_id | aktif | cakupan_akses | tgl_ditambahkan
function formatUserRowForSpreadsheet(u: any, classesList: any[]) {
  const assignedClasses = Array.isArray(u.assignedClassIds) ? u.assignedClassIds : [];
  const classIdStr = assignedClasses.length > 0 ? assignedClasses.join('; ') : '-';

  let cakupanAkses = 'Terbatas';
  if (u.role === 'admin') {
    cakupanAkses = 'Penuh (Administrator Sistem & Basis Data)';
  } else if (u.role === 'kepala_sekolah') {
    cakupanAkses = 'Eksekutif (Seluruh Kelas & Laporan)';
  } else if (u.role === 'guru_bk') {
    cakupanAkses = 'Layanan BK & Kasus Siswa (Seluruh Kelas)';
  } else if (u.role === 'wali_kelas') {
    if (assignedClasses.length > 0) {
      const classNames = assignedClasses.map((cid: string) => {
        const found = classesList?.find((c: any) => c.id === cid);
        return found ? found.name : cid;
      });
      cakupanAkses = `Perwalian: ${classNames.join(', ')}`;
    } else {
      cakupanAkses = 'Wali Kelas (Belum Ada Rombel Ditugaskan)';
    }
  }

  const tglDitambahkan = u.createdAt
    ? new Date(u.createdAt).toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('id-ID');

  return {
    user_id: u.id,
    nama_lengkap: u.name,
    email: u.email || '-',
    peran: u.roleLabel || u.role,
    class_id: classIdStr,
    aktif: u.isActive !== false ? 'Aktif' : 'Nonaktif',
    cakupan_akses: cakupanAkses,
    tgl_ditambahkan: tglDitambahkan,
  };
}

async function syncAllUsersToSpreadsheet() {
  const data = db.get();
  const rows = data.users.map((u: any) => formatUserRowForSpreadsheet(u, data.classes));
  return await syncToSpreadsheetWebhook('sync_table', {
    sheetName: 'Data_Pengguna',
    rows,
  });
}

// Spreadsheet Sync Endpoints
app.post('/api/spreadsheet/test-connection', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk', 'kepala_sekolah']), async (req: Request, res: Response) => {
  const { webhookUrl, spreadsheetId } = req.body;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return res.status(400).json({ error: 'URL Webhook Google Apps Script harus diawali dengan http:// atau https://' });
  }
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test',
        spreadsheetId: spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M',
        message: 'Uji koneksi dari Ruang Kelas SMK Fania',
        timestamp: new Date().toISOString(),
      }),
    });
    const result = await response.json();
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: `Gagal menghubungi Webhook Apps Script: ${err.message}` });
  }
});

// Dedicated endpoint to sync all classes to Data_Kelas sheet
app.post('/api/spreadsheet/sync-classes', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk', 'kepala_sekolah']), async (req: Request, res: Response) => {
  const data = db.get();
  const webhookUrl = req.body.webhookUrl || data.schoolProfile?.spreadsheetWebhookUrl;
  const spreadsheetId = req.body.spreadsheetId || data.schoolProfile?.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M';

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return res.status(400).json({ error: 'URL Webhook Google Apps Script belum dikonfigurasi. Silakan simpan Webhook URL terlebih dahulu.' });
  }

  const rows = data.classes.map((c: any) => formatClassRowForSpreadsheet(c, data.agreements, data.schoolProfile?.academicYear));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync_table',
        sheetName: 'Data_Kelas',
        spreadsheetId,
        rows,
        syncedAt: new Date().toISOString(),
      }),
    });
    const result = await response.json();
    recordAuditLog('Sinkronisasi Data Kelas ke Spreadsheet', 'Spreadsheet', 'Data_Kelas', `${rows.length} rombel disinkronkan ke lembar kerja Data_Kelas`, req);
    res.json({ success: true, count: rows.length, result });
  } catch (err: any) {
    res.status(500).json({ error: `Gagal sinkronisasi data kelas ke Spreadsheet: ${err.message}` });
  }
});

// Dedicated endpoint to sync all users to Data_Pengguna sheet
app.post('/api/spreadsheet/sync-users', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const data = db.get();
  const webhookUrl = req.body.webhookUrl || data.schoolProfile?.spreadsheetWebhookUrl;
  const spreadsheetId = req.body.spreadsheetId || data.schoolProfile?.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M';

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return res.status(400).json({ error: 'URL Webhook Google Apps Script belum dikonfigurasi. Silakan atur Webhook URL terlebih dahulu.' });
  }

  const rows = data.users.map((u: any) => formatUserRowForSpreadsheet(u, data.classes));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync_table',
        sheetName: 'Data_Pengguna',
        spreadsheetId,
        rows,
        syncedAt: new Date().toISOString(),
      }),
    });
    const result = await response.json();
    recordAuditLog('Sinkronisasi Data Pengguna ke Spreadsheet', 'Spreadsheet', 'Data_Pengguna', `${rows.length} akun pengguna disinkronkan ke lembar kerja Data_Pengguna`, req);
    res.json({ success: true, count: rows.length, result });
  } catch (err: any) {
    res.status(500).json({ error: `Gagal sinkronisasi data pengguna ke Spreadsheet: ${err.message}` });
  }
});

app.post('/api/spreadsheet/sync-all', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const data = db.get();
  const webhookUrl = req.body.webhookUrl || data.schoolProfile?.spreadsheetWebhookUrl;
  const spreadsheetId = req.body.spreadsheetId || data.schoolProfile?.spreadsheetId || '1_1f3nw3L-awZS4raaEytobG3LH43MqzVYmUlUCCJX5M';

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return res.status(400).json({ error: 'URL Webhook Google Apps Script belum dikonfigurasi.' });
  }

  try {
    const tables = {
      Data_Kelas: data.classes.map((c: any) => ({
        ID_Kelas: c.id,
        Nama_Kelas: c.name,
        Tingkat: c.grade,
        Jurusan: c.department,
        Tahun_Ajaran: c.academicYear,
        Wali_Kelas: c.homeroomTeacherName,
        Ruangan: c.room,
        Status_Kesepakatan: c.hasActiveAgreement ? 'Ada' : 'Belum Ada',
      })),
      Kesepakatan_Kelas: data.agreements.map((a: any) => ({
        ID: a.id,
        Nomor_Kesepakatan: a.agreementNumber,
        Kelas: a.className,
        Tahun_Ajaran: a.academicYear,
        Semester: a.semester,
        Judul: a.title,
        Tujuan: a.objectives,
        Norma_Positif: (a.positiveRules || []).join('; '),
        Tanggung_Jawab_Guru: (a.teacherResponsibilities || []).join('; '),
        Tanggung_Jawab_Siswa: (a.studentResponsibilities || []).join('; '),
        Konsekuensi_Edukasi: (a.educationalConsequences || []).join('; '),
        Status: a.status,
        Status_Persetujuan: a.approvalStatus,
        Tanggal_Dibuat: a.establishedDate,
      })),
      Catatan_Kejadian: data.incidents.map((i: any) => ({
        ID: i.id,
        Nomor_Kejadian: i.recordNumber,
        Tanggal: i.date,
        Waktu: i.time,
        Lokasi: i.location,
        Kelas: i.className,
        Nama_Siswa: i.studentName,
        Pencatat: `${i.recorderName} (${i.recorderRole})`,
        Observasi_Faktual: i.factualObservation,
        Perspektif_Siswa: i.studentPerspective,
        Tindakan_Awal: i.initialActionTaken,
        Saksi_Pendukung: i.witnessesOrSupporting,
        Status: i.status,
        Kerahasiaan: i.confidentialityLevel,
      })),
      Penanganan_Kasus: data.cases.map((c: any) => ({
        ID: c.id,
        Nomor_Kasus: c.caseNumber,
        Nomor_Kejadian: c.incidentNumber,
        Siswa: c.studentName,
        Kelas: c.className,
        Petugas: c.assignedOfficerName,
        Tanggal_Konseling: c.meetingDate,
        Ringkasan_Masalah: c.discussionSummary,
        Langkah_Pendampingan: (c.guidanceSteps || []).join('; '),
        Target_Perbaikan: c.improvementTarget,
        Evaluasi_Target: c.targetEvaluationDate,
        Komunikasi_Ortu: c.parentCommunication?.conducted ? `Ya (${c.parentCommunication.method || '-'})` : 'Belum',
        Status: c.status,
      })),
      Tindak_Lanjut: data.plans.map((p: any) => ({
        ID: p.id,
        Nomor_Rencana: p.planNumber,
        Judul_Agenda: p.title,
        Siswa: p.studentName,
        Kelas: p.className,
        Tanggal_Jadwal: p.scheduledDate,
        Lokasi: p.location,
        Petugas: p.assignedOfficer,
        Tujuan_Agenda: p.objective,
        Status: p.status,
        Catatan: p.notes || '-',
      })),
      Audit_Log: data.auditLogs.map((l: any) => ({
        Waktu: l.timestamp,
        Pengguna: l.userName,
        Peran: l.userRole,
        Aksi: l.action,
        Entitas: l.resourceType,
        Keterangan: l.summary,
      })),
      Data_Pengguna: data.users.map((u: any) => formatUserRowForSpreadsheet(u, data.classes)),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync_all',
        spreadsheetId,
        tables,
        syncedAt: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    recordAuditLog('Sinkronisasi Google Spreadsheet', 'Spreadsheet', spreadsheetId, 'Seluruh data disinkronkan ke Google Spreadsheet via Apps Script Webhook', req);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: `Gagal sinkronisasi ke Spreadsheet: ${err.message}` });
  }
});

// 3. Classes Management (CRUD)
app.get('/api/classes', requireAuth, (_req: Request, res: Response) => {
  const data = db.get();
  // Recalculate student counts and agreement status dynamically
  const updatedClasses = data.classes.map((cls: any) => {
    const studentCount = data.students.filter((s: any) => s.classId === cls.id).length;
    const activeAgr = data.agreements.find((a: any) => a.classId === cls.id && a.status === 'aktif');
    return {
      ...cls,
      totalStudents: studentCount,
      hasActiveAgreement: !!activeAgr,
      agreementId: activeAgr?.id,
    };
  });
  res.json(updatedClasses);
});

app.post('/api/classes', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk', 'kepala_sekolah']), async (req: Request, res: Response) => {
  const { name, grade, department, room, homeroomTeacherId, homeroomTeacherName, homeroomTeacherNip } = req.body;
  if (!name || !grade || !department) {
    return res.status(400).json({ error: 'Nama rombel, tingkat kelas, dan program studi wajib diisi.' });
  }

  const data = db.get();
  const cleanName = String(name).trim();
  const exists = data.classes.some((c: any) => c.name.toLowerCase() === cleanName.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `Rombel dengan nama "${cleanName}" sudah terdaftar.` });
  }

  const newClass = {
    id: `cls-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
    name: cleanName,
    grade: String(grade).toUpperCase(),
    department: String(department).trim(),
    academicYear: data.schoolProfile.academicYear,
    room: room ? String(room).trim() : 'Ruang Teori',
    homeroomTeacherId: homeroomTeacherId || '',
    homeroomTeacherName: homeroomTeacherName ? String(homeroomTeacherName).trim() : 'Belum Ditugaskan',
    homeroomTeacherNip: homeroomTeacherNip ? String(homeroomTeacherNip).trim() : '-',
    totalStudents: 0,
    hasActiveAgreement: false,
    createdAt: new Date().toISOString(),
  };

  data.classes.push(newClass);
  db.save();
  recordAuditLog('Tambah Rombel', 'ClassData', newClass.id, `Rombongan belajar baru ${newClass.name} (${newClass.department}) ditambahkan`, req);

  // Sync to Google Spreadsheet (Sheet: Data_Kelas)
  // Headers: ID_Kelas | Nama_Kelas | Tingkat | Jurusan | Tahun_Ajaran | Wali_Kelas | Ruangan | Status_Kesepakatan
  const classRow = formatClassRowForSpreadsheet(newClass, data.agreements, data.schoolProfile.academicYear);
  const syncResult = await syncToSpreadsheetWebhook('append', {
    sheetName: 'Data_Kelas',
    row: classRow,
  });

  res.status(201).json({
    ...newClass,
    spreadsheetSync: syncResult,
  });
});

app.put('/api/classes/:id', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk', 'kepala_sekolah']), async (req: Request, res: Response) => {
  const data = db.get();
  const idx = data.classes.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Data rombel tidak ditemukan.' });
  }

  const current = data.classes[idx];
  const { name, grade, department, room, homeroomTeacherId, homeroomTeacherName, homeroomTeacherNip } = req.body;

  const newName = name ? String(name).trim() : current.name;
  if (newName !== current.name) {
    const duplicate = data.classes.some((c: any) => c.id !== current.id && c.name.toLowerCase() === newName.toLowerCase());
    if (duplicate) {
      return res.status(400).json({ error: `Rombel dengan nama "${newName}" sudah ada.` });
    }
  }

  const updatedClass = {
    ...current,
    name: newName,
    grade: grade ? String(grade).toUpperCase() : current.grade,
    department: department ? String(department).trim() : current.department,
    room: room !== undefined ? String(room).trim() : current.room,
    homeroomTeacherId: homeroomTeacherId !== undefined ? homeroomTeacherId : current.homeroomTeacherId,
    homeroomTeacherName: homeroomTeacherName !== undefined ? String(homeroomTeacherName).trim() : current.homeroomTeacherName,
    homeroomTeacherNip: homeroomTeacherNip !== undefined ? String(homeroomTeacherNip).trim() : current.homeroomTeacherNip,
    updatedAt: new Date().toISOString(),
  };

  // Sync className in associated collections if name changed
  if (newName !== current.name) {
    data.students.forEach((s: any) => {
      if (s.classId === current.id) s.className = newName;
    });
    data.agreements.forEach((a: any) => {
      if (a.classId === current.id) a.className = newName;
    });
    data.incidents.forEach((i: any) => {
      if (i.classId === current.id) i.className = newName;
    });
    data.cases.forEach((c: any) => {
      if (c.classId === current.id) c.className = newName;
    });
  }

  data.classes[idx] = updatedClass;
  db.save();
  recordAuditLog('Edit Rombel', 'ClassData', current.id, `Data rombel ${updatedClass.name} diperbarui`, req);

  // Background sync updated classes to Google Spreadsheet
  syncAllClassesToSpreadsheet().catch((err) => console.warn('[Auto-sync Edit Rombel Warning]', err));

  res.json(updatedClass);
});

app.delete('/api/classes/:id', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk', 'kepala_sekolah']), async (req: Request, res: Response) => {
  const data = db.get();
  const classItem = data.classes.find((c: any) => c.id === req.params.id);
  if (!classItem) {
    return res.status(404).json({ error: 'Data rombel tidak ditemukan.' });
  }

  const force = req.query.force === 'true' || req.body?.force === true;
  const studentCount = data.students.filter((s: any) => s.classId === classItem.id).length;
  const hasAgreements = data.agreements.some((a: any) => a.classId === classItem.id);

  if (!force && (studentCount > 0 || hasAgreements)) {
    const reasons: string[] = [];
    if (studentCount > 0) reasons.push(`${studentCount} siswa terdaftar`);
    if (hasAgreements) reasons.push(`arsip piagam kesepakatan`);
    return res.status(400).json({
      canForce: true,
      studentCount,
      hasAgreements,
      error: `Rombel "${classItem.name}" masih memiliki ${reasons.join(' dan ')}. Pastikan telah dikosongkan atau konfirmasikan penghapusan menyeluruh.`,
    });
  }

  // If force is requested, clean up associated records
  if (force) {
    data.students = data.students.filter((s: any) => s.classId !== classItem.id);
    data.agreements = data.agreements.filter((a: any) => a.classId !== classItem.id);
  }

  data.classes = data.classes.filter((c: any) => c.id !== classItem.id);
  db.save();
  recordAuditLog('Hapus Rombel', 'ClassData', classItem.id, `Rombongan belajar ${classItem.name} dihapus dari sistem (Force: ${force})`, req);

  // Background sync remaining classes to Google Spreadsheet
  syncAllClassesToSpreadsheet().catch((err) => console.warn('[Auto-sync Delete Rombel Warning]', err));

  res.json({ success: true, message: `Rombel "${classItem.name}" berhasil dihapus.` });
});

// 4. Students Management
app.get('/api/students', requireAuth, (req: Request, res: Response) => {
  const data = db.get();
  const { classId } = req.query;
  let result = data.students;
  if (classId) {
    result = result.filter((s: any) => s.classId === classId);
  }
  res.json(result);
});

app.post('/api/students', requireAuth, requireRole(['admin', 'wali_kelas']), (req: Request, res: Response) => {
  const { name, nisn, gender, classId, guardianName, guardianPhone } = req.body;
  if (!name || !classId) {
    return res.status(400).json({ error: 'Nama siswa dan rombel belajar wajib diisi.' });
  }

  const data = db.get();
  const targetClass = data.classes.find((c: any) => c.id === classId);
  if (!targetClass) {
    return res.status(400).json({ error: 'Rombel tujuan tidak valid.' });
  }

  const newStudent = {
    id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: String(name).trim(),
    nisn: nisn ? String(nisn).trim() : '-',
    gender: gender === 'P' ? 'P' : 'L',
    classId,
    className: targetClass.name,
    guardianName: guardianName ? String(guardianName).trim() : '-',
    guardianPhone: guardianPhone ? String(guardianPhone).trim() : '-',
    createdAt: new Date().toISOString(),
  };

  data.students.push(newStudent);
  db.save();
  recordAuditLog('Tambah Siswa', 'Student', newStudent.id, `Peserta didik ${newStudent.name} didaftarkan ke ${targetClass.name}`, req);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', requireAuth, requireRole(['admin', 'wali_kelas']), (req: Request, res: Response) => {
  const data = db.get();
  const idx = data.students.findIndex((s: any) => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
  }

  const cur = data.students[idx];
  const { name, nisn, gender, classId, guardianName, guardianPhone } = req.body;
  let targetClass = data.classes.find((c: any) => c.id === (classId || cur.classId));

  data.students[idx] = {
    ...cur,
    name: name || cur.name,
    nisn: nisn !== undefined ? nisn : cur.nisn,
    gender: gender !== undefined ? gender : cur.gender,
    classId: targetClass ? targetClass.id : cur.classId,
    className: targetClass ? targetClass.name : cur.className,
    guardianName: guardianName !== undefined ? guardianName : cur.guardianName,
    guardianPhone: guardianPhone !== undefined ? guardianPhone : cur.guardianPhone,
    updatedAt: new Date().toISOString(),
  };

  db.save();
  res.json(data.students[idx]);
});

app.delete('/api/students/:id', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const data = db.get();
  const student = data.students.find((s: any) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
  }

  data.students = data.students.filter((s: any) => s.id !== student.id);
  db.save();
  recordAuditLog('Hapus Siswa', 'Student', student.id, `Peserta didik ${student.name} dihapus dari data operasional`, req);
  res.json({ success: true, message: `Data siswa "${student.name}" berhasil dihapus.` });
});

// 5. Class Agreements (CRUD)
app.get('/api/agreements', requireAuth, (_req: Request, res: Response) => {
  res.json(db.get().agreements);
});

app.post('/api/agreements', requireAuth, requireRole(['admin', 'wali_kelas']), (req: Request, res: Response) => {
  const {
    classId,
    title,
    objectives,
    positiveRules,
    teacherResponsibilities,
    studentResponsibilities,
    educationalConsequences,
    evaluationMethod,
    reviewDate,
    studentRepresentativeName,
    participantsCount,
  } = req.body;

  if (!classId || !title || !objectives) {
    return res.status(400).json({ error: 'Kelas, judul kesepakatan, dan tujuan bersama wajib diisi.' });
  }

  const data = db.get();
  const targetClass = data.classes.find((c: any) => c.id === classId);
  const user = (req as any).user as SessionUser;

  const yyyy = data.schoolProfile.academicYear.substring(0, 4);
  const cleanClass = (targetClass?.name || 'KELAS').replace(/\s+/g, '-');
  const count = data.agreements.filter((a: any) => a.classId === classId).length + 1;
  const agreementNumber = `KK/${yyyy}/${cleanClass}/${String(count).padStart(2, '0')}`;

  const newAgreement = {
    id: `agr-${Date.now()}`,
    agreementNumber,
    classId,
    className: targetClass ? targetClass.name : 'Kelas',
    academicYear: data.schoolProfile.academicYear,
    semester: data.schoolProfile.semester,
    title: String(title).trim(),
    objectives: String(objectives).trim(),
    positiveRules: Array.isArray(positiveRules) ? positiveRules.filter(Boolean) : [],
    teacherResponsibilities: Array.isArray(teacherResponsibilities) ? teacherResponsibilities.filter(Boolean) : [],
    studentResponsibilities: Array.isArray(studentResponsibilities) ? studentResponsibilities.filter(Boolean) : [],
    educationalConsequences: Array.isArray(educationalConsequences) ? educationalConsequences.filter(Boolean) : [],
    evaluationMethod: evaluationMethod || 'Refleksi berkala dua pekanan',
    establishedDate: new Date().toISOString().split('T')[0],
    reviewDate: reviewDate || new Date().toISOString().split('T')[0],
    status: 'aktif',
    participantsCount: Number(participantsCount) || 34,
    approvalStatus: 'Disetujui Seluruh Peserta',
    studentRepresentativeName: studentRepresentativeName || 'Ketua Kelas',
    homeroomTeacherName: user.name,
    revisions: [
      {
        id: `rev-${Date.now()}`,
        revisionNumber: 1,
        date: new Date().toISOString().split('T')[0],
        authorName: user.name,
        authorRole: user.roleLabel,
        summaryOfChange: 'Penyusunan awal kesepakatan dan budaya positif kelas.',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  data.agreements.unshift(newAgreement);
  db.save();
  recordAuditLog('Penyusunan Kesepakatan', 'ClassAgreement', newAgreement.id, `Piagam kesepakatan kelas dibuat untuk ${newAgreement.className}`, req);
  syncToSpreadsheetWebhook('append', {
    sheetName: 'Kesepakatan_Kelas',
    row: {
      ID: newAgreement.id,
      Nomor_Kesepakatan: newAgreement.agreementNumber,
      Kelas: newAgreement.className,
      Tahun_Ajaran: newAgreement.academicYear,
      Semester: newAgreement.semester,
      Judul: newAgreement.title,
      Tujuan: newAgreement.objectives,
      Norma_Positif: newAgreement.positiveRules.join('; '),
      Tanggung_Jawab_Guru: newAgreement.teacherResponsibilities.join('; '),
      Tanggung_Jawab_Siswa: newAgreement.studentResponsibilities.join('; '),
      Konsekuensi_Edukasi: newAgreement.educationalConsequences.join('; '),
      Status: newAgreement.status,
      Status_Persetujuan: newAgreement.approvalStatus,
      Tanggal_Dibuat: newAgreement.establishedDate,
    },
  });
  res.status(201).json(newAgreement);
});

app.put('/api/agreements/:id', requireAuth, requireRole(['admin', 'wali_kelas']), (req: Request, res: Response) => {
  const data = db.get();
  const idx = data.agreements.findIndex((a: any) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Kesepakatan kelas tidak ditemukan.' });
  }

  const cur = data.agreements[idx];
  const user = (req as any).user as SessionUser;
  const { revisionNote, ...updates } = req.body;

  const revisions = [...cur.revisions];
  if (revisionNote) {
    revisions.push({
      id: `rev-${Date.now()}`,
      revisionNumber: revisions.length + 1,
      date: new Date().toISOString().split('T')[0],
      authorName: user.name,
      authorRole: user.roleLabel,
      summaryOfChange: revisionNote,
    });
  }

  data.agreements[idx] = {
    ...cur,
    ...updates,
    revisions,
    updatedAt: new Date().toISOString(),
  };

  db.save();
  recordAuditLog('Perbarui Kesepakatan', 'ClassAgreement', cur.id, `Kesepakatan kelas ${cur.className} diperbarui (${revisionNote || 'Pembaruan data'})`, req);
  res.json(data.agreements[idx]);
});

// 6. Incident Records (Objective & Factual Journal)
app.get('/api/incidents', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as SessionUser;
  const data = db.get();

  // RBAC scope: Wali kelas only views incidents for assigned classes (or all if admin/BK/kepsek)
  let result = data.incidents;
  if (user.role === 'wali_kelas' && user.assignedClassIds && user.assignedClassIds.length > 0) {
    result = result.filter((i: any) => user.assignedClassIds.includes(i.classId));
  }

  res.json(result);
});

app.post('/api/incidents', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk']), (req: Request, res: Response) => {
  const {
    classId,
    studentId,
    studentName,
    date,
    time,
    location,
    factualObservation,
    studentPerspective,
    initialActionTaken,
    witnessesOrSupporting,
    confidentialityLevel,
  } = req.body;

  if (!classId || !factualObservation) {
    return res.status(400).json({ error: 'Kelas dan uraian faktual kejadian wajib diisi.' });
  }

  const data = db.get();
  const user = (req as any).user as SessionUser;
  const targetClass = data.classes.find((c: any) => c.id === classId);
  const targetStudent = studentId ? data.students.find((s: any) => s.id === studentId) : null;

  const dateObj = new Date();
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const cleanClass = (targetClass?.name || 'KELAS').replace(/\s+/g, '-');
  const count = data.incidents.length + 1;
  const recordNumber = `CK/${yyyy}/${mm}/${cleanClass}/${String(count).padStart(3, '0')}`;

  const newIncident = {
    id: `inc-${Date.now()}`,
    recordNumber,
    date: date || dateObj.toISOString().split('T')[0],
    time: time || `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')} WIB`,
    location: location || 'Ruang Kelas',
    classId,
    className: targetClass ? targetClass.name : 'Kelas',
    studentId: targetStudent ? targetStudent.id : (studentId || 'std-unknown'),
    studentName: targetStudent ? targetStudent.name : (studentName || 'Peserta Didik'),
    recorderId: user.userId,
    recorderName: user.name,
    recorderRole: user.roleLabel,
    factualObservation: String(factualObservation).trim(),
    studentPerspective: studentPerspective ? String(studentPerspective).trim() : '',
    initialActionTaken: initialActionTaken ? String(initialActionTaken).trim() : '',
    witnessesOrSupporting: witnessesOrSupporting ? String(witnessesOrSupporting).trim() : 'Tidak ada',
    status: 'baru',
    confidentialityLevel: confidentialityLevel || 'internal_kelas',
    createdAt: new Date().toISOString(),
  };

  data.incidents.unshift(newIncident);
  db.save();
  recordAuditLog('Catat Kejadian Faktual', 'IncidentRecord', newIncident.id, `Catatan faktual dibuat no ${recordNumber}`, req);
  syncToSpreadsheetWebhook('append', {
    sheetName: 'Catatan_Kejadian',
    row: {
      ID: newIncident.id,
      Nomor_Kejadian: newIncident.recordNumber,
      Tanggal: newIncident.date,
      Waktu: newIncident.time,
      Lokasi: newIncident.location,
      Kelas: newIncident.className,
      Nama_Siswa: newIncident.studentName,
      Pencatat: `${newIncident.recorderName} (${newIncident.recorderRole})`,
      Observasi_Faktual: newIncident.factualObservation,
      Perspektif_Siswa: newIncident.studentPerspective,
      Tindakan_Awal: newIncident.initialActionTaken,
      Saksi_Pendukung: newIncident.witnessesOrSupporting,
      Status: newIncident.status,
      Kerahasiaan: newIncident.confidentialityLevel,
    },
  });
  res.status(201).json(newIncident);
});

app.put('/api/incidents/:id/status', requireAuth, requireRole(['admin', 'wali_kelas', 'guru_bk']), (req: Request, res: Response) => {
  const { status } = req.body;
  const data = db.get();
  const incident = data.incidents.find((i: any) => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Catatan kejadian tidak ditemukan.' });
  }

  incident.status = status;
  incident.updatedAt = new Date().toISOString();
  db.save();
  recordAuditLog('Ubah Status Kejadian', 'IncidentRecord', incident.id, `Status kejadian ${incident.recordNumber} diubah ke ${status}`, req);
  res.json(incident);
});

// 7. Case Handling (BK & Restorative Guidance)
app.get('/api/cases', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as SessionUser;
  const data = db.get();

  // Strict confidentiality: Wali kelas can only see cases assigned to them or their perwalian
  let result = data.cases;
  if (user.role === 'wali_kelas') {
    result = result.filter(
      (c: any) => c.assignedOfficerId === user.userId || (user.assignedClassIds && user.assignedClassIds.includes(c.classId))
    );
  }

  res.json(result);
});

app.post('/api/cases', requireAuth, requireRole(['admin', 'guru_bk', 'wali_kelas']), (req: Request, res: Response) => {
  const {
    incidentRecordId,
    assignedOfficerId,
    assignedOfficerName,
    assignedOfficerRole,
    discussionSummary,
    guidanceSteps,
    improvementTarget,
    targetEvaluationDate,
  } = req.body;

  const data = db.get();
  const incident = data.incidents.find((i: any) => i.id === incidentRecordId);
  const user = (req as any).user as SessionUser;

  const count = data.cases.length + 1;
  const cleanClass = (incident?.className || 'KELAS').replace(/\s+/g, '-');
  const caseNumber = `PK/2026/${cleanClass}/${String(count).padStart(3, '0')}`;

  const newCase = {
    id: `case-${Date.now()}`,
    caseNumber,
    incidentRecordId: incidentRecordId || '',
    incidentNumber: incident?.recordNumber || '-',
    studentId: incident?.studentId || 'std-1',
    studentName: incident?.studentName || 'Peserta Didik',
    classId: incident?.classId || 'cls-1',
    className: incident?.className || 'Kelas',
    assignedOfficerId: assignedOfficerId || user.userId,
    assignedOfficerName: assignedOfficerName || user.name,
    assignedOfficerRole: assignedOfficerRole || user.roleLabel,
    meetingDate: new Date().toISOString().split('T')[0],
    discussionSummary: discussionSummary || '',
    guidanceSteps: Array.isArray(guidanceSteps) ? guidanceSteps : ['Dialog reflektif', 'Penyusunan target perbaikan'],
    improvementTarget: improvementTarget || 'Pemulihan komitmen belajar positif.',
    targetEvaluationDate: targetEvaluationDate || new Date().toISOString().split('T')[0],
    parentCommunication: { conducted: false },
    status: 'dalam_penanganan',
    progressNotes: [
      {
        id: `cpn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: '09:00 WIB',
        officerName: user.name,
        officerRole: user.roleLabel,
        note: 'Inisiasi program pendampingan dan penugasan pembimbing.',
        studentResponse: 'Siswa bersedia bekerjasama dalam sesi pendampingan edukatif.',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  data.cases.unshift(newCase);
  if (incident) {
    incident.status = 'dalam_tindak_lanjut';
    incident.caseHandlingId = newCase.id;
  }
  db.save();
  recordAuditLog('Buka Kasus Pendampingan', 'CaseHandling', newCase.id, `Inisiasi kasus pendampingan ${caseNumber}`, req);
  syncToSpreadsheetWebhook('append', {
    sheetName: 'Penanganan_Kasus',
    row: {
      ID: newCase.id,
      Nomor_Kasus: newCase.caseNumber,
      Nomor_Kejadian: newCase.incidentNumber,
      Siswa: newCase.studentName,
      Kelas: newCase.className,
      Petugas: newCase.assignedOfficerName,
      Tanggal_Konseling: newCase.meetingDate,
      Ringkasan_Masalah: newCase.discussionSummary,
      Langkah_Pendampingan: newCase.guidanceSteps.join('; '),
      Target_Perbaikan: newCase.improvementTarget,
      Evaluasi_Target: newCase.targetEvaluationDate,
      Komunikasi_Ortu: 'Belum',
      Status: newCase.status,
    },
  });
  res.status(201).json(newCase);
});

app.post('/api/cases/:id/progress', requireAuth, requireRole(['admin', 'guru_bk', 'wali_kelas']), (req: Request, res: Response) => {
  const { note, studentResponse, nextCheckDate } = req.body;
  if (!note) {
    return res.status(400).json({ error: 'Catatan perkembangan wajib diisi.' });
  }

  const data = db.get();
  const caseItem = data.cases.find((c: any) => c.id === req.params.id);
  if (!caseItem) {
    return res.status(404).json({ error: 'Berkas kasus tidak ditemukan.' });
  }

  const user = (req as any).user as SessionUser;
  const now = new Date();
  const newProgress = {
    id: `cpn-${Date.now()}`,
    date: now.toISOString().split('T')[0],
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`,
    officerName: user.name,
    officerRole: user.roleLabel,
    note: String(note).trim(),
    studentResponse: studentResponse ? String(studentResponse).trim() : '',
    nextCheckDate: nextCheckDate || undefined,
  };

  caseItem.progressNotes.unshift(newProgress);
  caseItem.updatedAt = now.toISOString();
  db.save();
  recordAuditLog('Tambah Catatan Perkembangan', 'CaseHandling', caseItem.id, `Catatan sesi ditambahkan pada kasus ${caseItem.caseNumber}`, req);
  res.status(201).json(newProgress);
});

app.put('/api/cases/:id/status', requireAuth, requireRole(['admin', 'guru_bk']), (req: Request, res: Response) => {
  const { status, resolutionSummary } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status target wajib diisi.' });
  }

  const data = db.get();
  const caseItem = data.cases.find((c: any) => c.id === req.params.id);
  if (!caseItem) {
    return res.status(404).json({ error: 'Berkas kasus tidak ditemukan.' });
  }

  caseItem.status = status;
  if (status === 'selesai') {
    caseItem.completedDate = new Date().toISOString().split('T')[0];
    caseItem.resolutionSummary = resolutionSummary || 'Kasus diselesaikan tuntas dengan dialog pemulihan hubungan.';
  }
  caseItem.updatedAt = new Date().toISOString();
  db.save();
  recordAuditLog('Pembaruan Status Kasus', 'CaseHandling', caseItem.id, `Status kasus ${caseItem.caseNumber} diubah ke ${status}`, req);
  res.json(caseItem);
});

// 8. Follow-Up Plans (RTL)
app.get('/api/plans', requireAuth, (_req: Request, res: Response) => {
  res.json(db.get().plans);
});

app.post('/api/plans', requireAuth, requireRole(['admin', 'guru_bk', 'wali_kelas']), (req: Request, res: Response) => {
  const { title, studentName, className, scheduledDate, location, assignedOfficer, objective } = req.body;
  if (!title || !scheduledDate) {
    return res.status(400).json({ error: 'Judul dan tanggal rencana tindak lanjut wajib diisi.' });
  }

  const data = db.get();
  const count = data.plans.length + 1;
  const newPlan = {
    id: `fup-${Date.now()}`,
    planNumber: `RTL/2026/${String(count).padStart(3, '0')}`,
    title: String(title).trim(),
    studentName: studentName || 'Peserta Didik',
    className: className || 'Kelas',
    scheduledDate,
    location: location || 'Ruang Konseling BK',
    assignedOfficer: assignedOfficer || (req as any).user.name,
    objective: objective || 'Evaluasi berkala tindak lanjut komitmen siswa',
    status: 'terjadwal',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString(),
  };

  data.plans.unshift(newPlan);
  db.save();
  recordAuditLog('Jadwalkan RTL', 'FollowUpPlan', newPlan.id, `Agenda RTL ${newPlan.title} dijadwalkan`, req);
  syncToSpreadsheetWebhook('append', {
    sheetName: 'Tindak_Lanjut',
    row: {
      ID: newPlan.id,
      Nomor_Rencana: newPlan.planNumber,
      Judul_Agenda: newPlan.title,
      Siswa: newPlan.studentName,
      Kelas: newPlan.className,
      Tanggal_Jadwal: newPlan.scheduledDate,
      Lokasi: newPlan.location,
      Petugas: newPlan.assignedOfficer,
      Tujuan_Agenda: newPlan.objective,
      Status: newPlan.status,
      Catatan: newPlan.notes || '-',
    },
  });
  res.status(201).json(newPlan);
});

app.put('/api/plans/:id/status', requireAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  const data = db.get();
  const plan = data.plans.find((p: any) => p.id === req.params.id);
  if (!plan) {
    return res.status(404).json({ error: 'Rencana tindak lanjut tidak ditemukan.' });
  }

  plan.status = status;
  plan.updatedAt = new Date().toISOString();
  db.save();
  res.json(plan);
});

app.delete('/api/plans/:id', requireAuth, requireRole(['admin', 'guru_bk']), (req: Request, res: Response) => {
  const data = db.get();
  data.plans = data.plans.filter((p: any) => p.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// 9. Users Management (RBAC)
app.get('/api/users', requireAuth, (_req: Request, res: Response) => {
  const data = db.get();
  // Strip sensitive hashes before returning
  const safeUsers = data.users.map(({ passwordHash, salt, ...rest }: any) => rest);
  res.json(safeUsers);
});

app.post('/api/users', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const { username, password, name, nip, role, roleLabel, email, assignedClassIds } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ error: 'Username, password, nama lengkap, dan peran wajib diisi.' });
  }

  const data = db.get();
  const cleanUser = String(username).trim().toLowerCase();
  const exists = data.users.some((u: any) => u.username.toLowerCase() === cleanUser);
  if (exists) {
    return res.status(400).json({ error: `Username "${cleanUser}" sudah digunakan.` });
  }

  const { hash, salt } = hashPassword(String(password).trim());
  const newUser = {
    id: `usr-${Date.now()}`,
    username: cleanUser,
    name: String(name).trim(),
    nip: nip ? String(nip).trim() : '-',
    role,
    roleLabel: roleLabel || role,
    email: email || `${cleanUser}@smkfania.sch.id`,
    salt,
    passwordHash: hash,
    isActive: true,
    assignedClassIds: Array.isArray(assignedClassIds) ? assignedClassIds : [],
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  db.save();
  recordAuditLog('Tambah Pengguna', 'User', newUser.id, `Akun pengguna ${newUser.name} (${newUser.role}) dibuat`, req);

  // Sync new user to Google Spreadsheet (Sheet: Data_Pengguna)
  // Headers: user_id | nama_lengkap | email | peran | class_id | aktif | cakupan_akses | tgl_ditambahkan
  const userRow = formatUserRowForSpreadsheet(newUser, data.classes);
  const syncResult = await syncToSpreadsheetWebhook('append', {
    sheetName: 'Data_Pengguna',
    row: userRow,
  });

  const { passwordHash: _, salt: __, ...safeUser } = newUser;
  res.status(201).json({
    ...safeUser,
    spreadsheetSync: syncResult,
  });
});

app.put('/api/users/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const data = db.get();
  const user = data.users.find((u: any) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  }

  const { name, nip, role, roleLabel, email, assignedClassIds, password, isActive } = req.body;

  if (name) user.name = String(name).trim();
  if (nip !== undefined) user.nip = String(nip).trim();
  if (role) user.role = role;
  if (roleLabel) user.roleLabel = roleLabel;
  if (email) user.email = email;
  if (assignedClassIds) user.assignedClassIds = assignedClassIds;
  if (isActive !== undefined) user.isActive = Boolean(isActive);

  if (password && String(password).trim()) {
    const { hash, salt } = hashPassword(String(password).trim());
    user.salt = salt;
    user.passwordHash = hash;
  }

  user.updatedAt = new Date().toISOString();
  db.save();
  recordAuditLog('Edit Pengguna', 'User', user.id, `Data akun ${user.name} diperbarui oleh Administrator`, req);

  // Background sync updated users to Google Spreadsheet (Sheet: Data_Pengguna)
  syncAllUsersToSpreadsheet().catch((err) => console.warn('[Auto-sync Edit User Warning]', err));

  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json(safeUser);
});

app.delete('/api/users/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const sessionUser = (req as any).user as SessionUser;
  if (sessionUser.userId === req.params.id) {
    return res.status(400).json({ error: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' });
  }

  const data = db.get();
  const user = data.users.find((u: any) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  }

  if (user.username === 'smkfania') {
    return res.status(400).json({ error: 'Akun Administrator Utama tidak dapat dihapus.' });
  }

  data.users = data.users.filter((u: any) => u.id !== user.id);
  db.save();
  recordAuditLog('Hapus Pengguna', 'User', user.id, `Pengguna ${user.name} dihapus dari sistem`, req);

  // Background sync remaining users to Google Spreadsheet (Sheet: Data_Pengguna)
  syncAllUsersToSpreadsheet().catch((err) => console.warn('[Auto-sync Delete User Warning]', err));

  res.json({ success: true, message: `Pengguna "${user.name}" berhasil dihapus.` });
});

// 10. Audit Logs Endpoint
app.get('/api/audit-logs', requireAuth, requireRole(['admin', 'kepala_sekolah']), (_req: Request, res: Response) => {
  res.json(db.get().auditLogs);
});

// 11. Dashboard Aggregated Stats (100% Calculated from Real Stored Records)
app.get('/api/dashboard/stats', requireAuth, (req: Request, res: Response) => {
  const { classId } = req.query;
  const user = (req as any).user as SessionUser;
  const data = db.get();

  let agreements = data.agreements;
  let incidents = data.incidents;
  let cases = data.cases;
  let plans = data.plans;

  // Filter by role if restricted
  if (user.role === 'wali_kelas' && user.assignedClassIds && user.assignedClassIds.length > 0) {
    incidents = incidents.filter((i: any) => user.assignedClassIds.includes(i.classId));
    cases = cases.filter((c: any) => user.assignedClassIds.includes(c.classId));
  }

  // Filter by query classId if selected
  if (classId && classId !== 'all') {
    agreements = agreements.filter((a: any) => a.classId === classId);
    incidents = incidents.filter((i: any) => i.classId === classId);
    cases = cases.filter((c: any) => c.classId === classId);
    const targetClass = data.classes.find((c: any) => c.id === classId);
    if (targetClass) {
      plans = plans.filter((p: any) => p.className === targetClass.name);
    }
  }

  const activeAgreementsCount = agreements.filter((a: any) => a.status === 'aktif').length;
  const pendingIncidentsCount = incidents.filter((i: any) => i.status === 'baru' || i.status === 'dalam_tindak_lanjut').length;
  const activeCasesCount = cases.filter((c: any) => c.status === 'dalam_penanganan' || c.status === 'menunggu_tindak_lanjut').length;
  const scheduledPlansCount = plans.filter((p: any) => p.status === 'terjadwal').length;
  const totalClassesCount = data.classes.length;
  const totalStudentsCount = data.students.length;

  res.json({
    activeAgreementsCount,
    pendingIncidentsCount,
    activeCasesCount,
    scheduledPlansCount,
    totalClassesCount,
    totalStudentsCount,
  });
});

// 12. Optional Demo Data Seeding & Clearing Tools (Clearly separated!)
app.post('/api/system/seed-demo', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const data = db.get();
  // Mark demo entries with isDemo: true so they can be isolated or purged
  const demoStudents = [
    { id: 'demo-std-1', name: 'Ahmad Faiz (DEMO)', nisn: '0081234001', gender: 'L', classId: 'cls-xi-tlm', className: 'XI TLM', guardianName: 'Bambang Pratama', guardianPhone: '0812-3456-7890', isDemo: true },
    { id: 'demo-std-2', name: 'Siti Rahma (DEMO)', nisn: '0081234002', gender: 'P', classId: 'cls-xi-tlm', className: 'XI TLM', guardianName: 'Rahmawati', guardianPhone: '0813-9876-5432', isDemo: true },
    { id: 'demo-std-3', name: 'Putri Zahra (DEMO)', nisn: '0081234003', gender: 'P', classId: 'cls-xi-far-a', className: 'XI FAR-A', guardianName: 'Kusworo', guardianPhone: '0812-7788-9900', isDemo: true },
  ];

  data.students = [...data.students.filter((s: any) => !s.isDemo), ...demoStudents];
  db.save();
  recordAuditLog('Seed Data Uji', 'System', 'demo', 'Data simulasi pengujian berlabel DEMO dimasukkan oleh Administrator', req);
  res.json({ success: true, message: 'Data simulasi berlabel DEMO berhasil disiapkan.' });
});

app.post('/api/system/clear-demo', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const data = db.get();
  data.students = data.students.filter((s: any) => !s.isDemo);
  data.incidents = data.incidents.filter((i: any) => !i.isDemo);
  data.cases = data.cases.filter((c: any) => !c.isDemo);
  data.agreements = data.agreements.filter((a: any) => !a.isDemo);
  db.save();
  recordAuditLog('Bersihkan Data Uji', 'System', 'demo', 'Seluruh data bertanda DEMO dihapus, hanya menyisakan data operasional riil', req);
  res.json({ success: true, message: 'Seluruh data pengujian berlabel DEMO berhasil dibersihkan.' });
});

// ======================== SERVER & VITE INTEGRATION ========================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Attach Vite as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Ruang Kelas running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
