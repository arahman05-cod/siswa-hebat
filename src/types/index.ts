export type UserRole = 'admin' | 'wali_kelas' | 'guru_bk' | 'kepala_sekolah';

export interface UserProfile {
  id: string;
  name: string;
  nip: string;
  role: UserRole;
  roleLabel: string;
  assignedClassIds?: string[];
  email: string;
  avatarInitials: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
}

export interface ClassData {
  id: string;
  name: string;
  grade: 'X' | 'XI' | 'XII';
  department: string;
  academicYear: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  homeroomTeacherNip: string;
  totalStudents: number;
  hasActiveAgreement: boolean;
  agreementId?: string;
  room: string;
}

export interface AgreementRevision {
  id: string;
  revisionNumber: number;
  date: string;
  authorName: string;
  authorRole: string;
  summaryOfChange: string;
}

export interface ClassAgreement {
  id: string;
  agreementNumber: string;
  classId: string;
  className: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  title: string;
  objectives: string;
  positiveRules: string[];
  teacherResponsibilities: string[];
  studentResponsibilities: string[];
  educationalConsequences: string[];
  evaluationMethod: string;
  establishedDate: string;
  reviewDate: string;
  status: 'aktif' | 'draf' | 'diarsipkan';
  participantsCount: number;
  approvalStatus: 'Disetujui Seluruh Peserta' | 'Menunggu Konfirmasi' | 'Draf Awal';
  studentRepresentativeName: string;
  homeroomTeacherName: string;
  revisions: AgreementRevision[];
}

export interface IncidentRecord {
  id: string;
  recordNumber: string;
  date: string;
  time: string;
  location: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  recorderId: string;
  recorderName: string;
  recorderRole: string;
  // Separation of facts vs perspectives vs initial support
  factualObservation: string;
  studentPerspective: string;
  initialActionTaken: string;
  witnessesOrSupporting: string;
  status: 'baru' | 'dalam_tindak_lanjut' | 'selesai_di_kelas' | 'dialihkan_ke_bk';
  confidentialityLevel: 'internal_kelas' | 'terbatas_bk' | 'rahasia_tim';
  caseHandlingId?: string;
}

export interface CaseProgressNote {
  id: string;
  date: string;
  time: string;
  officerName: string;
  officerRole: string;
  note: string;
  studentResponse: string;
  nextCheckDate?: string;
}

export interface CaseHandling {
  id: string;
  caseNumber: string;
  incidentRecordId: string;
  incidentNumber: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  assignedOfficerRole: string;
  meetingDate: string;
  discussionSummary: string;
  guidanceSteps: string[];
  improvementTarget: string;
  targetEvaluationDate: string;
  parentCommunication: {
    conducted: boolean;
    date?: string;
    method?: string; // Tatap muka, telepon, dsb.
    notes?: string;
  };
  status: 'baru' | 'dalam_penanganan' | 'menunggu_tindak_lanjut' | 'selesai' | 'dirujuk';
  progressNotes: CaseProgressNote[];
  completedDate?: string;
  resolutionSummary?: string;
}

export interface FollowUpPlan {
  id: string;
  planNumber: string;
  title: string;
  studentName: string;
  className: string;
  caseNumber?: string;
  scheduledDate: string;
  location: string;
  assignedOfficer: string;
  objective: string;
  status: 'terjadwal' | 'berlangsung' | 'selesai' | 'dijadwalkan_ulang';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  summary: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  headmasterName: string;
  headmasterNip: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  confidentialityPolicyVersion: string;
  dataRetentionPeriodYears: number;
  spreadsheetId?: string;
  spreadsheetWebhookUrl?: string;
}
