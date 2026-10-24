import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  ClassData,
  Student,
  ClassAgreement,
  IncidentRecord,
  CaseHandling,
  CaseProgressNote,
  FollowUpPlan,
  AuditLogEntry,
  SchoolProfile,
  UserRole,
} from '../types';

interface AppContextType {
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  classes: ClassData[];
  students: Student[];
  classAgreements: ClassAgreement[];
  incidentRecords: IncidentRecord[];
  caseHandlings: CaseHandling[];
  followUpPlans: FollowUpPlan[];
  auditLogs: AuditLogEntry[];
  schoolProfile: SchoolProfile;
  users: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth
  login: (username: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  // Actions
  addClass: (classData: Partial<ClassData>) => Promise<ClassData>;
  updateClass: (id: string, classData: Partial<ClassData>) => Promise<ClassData>;
  deleteClass: (id: string, force?: boolean) => Promise<void>;
  addStudent: (studentData: Partial<Student>) => Promise<Student>;
  updateStudent: (id: string, studentData: Partial<Student>) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  addUser: (userData: Partial<UserProfile> & { password?: string; username?: string }) => Promise<UserProfile>;
  updateUser: (id: string, updated: Partial<UserProfile> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createClassAgreement: (agreement: Partial<ClassAgreement>) => Promise<ClassAgreement>;
  updateClassAgreement: (id: string, updated: Partial<ClassAgreement>, revisionNote?: string) => Promise<void>;
  createIncidentRecord: (record: Partial<IncidentRecord>) => Promise<IncidentRecord>;
  updateIncidentStatus: (id: string, status: IncidentRecord['status']) => Promise<void>;
  addCaseProgressNote: (caseId: string, note: string, studentResponse: string, nextCheckDate?: string) => Promise<void>;
  updateCaseStatus: (caseId: string, status: CaseHandling['status'], resolutionSummary?: string) => Promise<void>;
  createCaseFromIncident: (incidentId: string, assignedOfficerId: string, guidanceSummary: string, targetDate: string) => Promise<CaseHandling>;
  createFollowUpPlan: (plan: Partial<FollowUpPlan>) => Promise<FollowUpPlan>;
  updateFollowUpPlanStatus: (id: string, status: FollowUpPlan['status']) => Promise<void>;
  deleteFollowUpPlan: (id: string) => Promise<void>;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => Promise<void>;
  testSpreadsheetConnection: (webhookUrl: string, spreadsheetId?: string) => Promise<any>;
  syncClassesToSpreadsheet: (webhookUrl?: string, spreadsheetId?: string) => Promise<any>;
  syncUsersToSpreadsheet: (webhookUrl?: string, spreadsheetId?: string) => Promise<any>;
  syncAllToSpreadsheet: (webhookUrl?: string, spreadsheetId?: string) => Promise<any>;
  seedDemoData: () => Promise<void>;
  clearDemoData: () => Promise<void>;
  refreshData: () => Promise<void>;
  addAuditLog: (action: string, resourceType: string, resourceId: string, summary: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'ruang_kelas_auth_token';

const defaultSchoolProfile: SchoolProfile = {
  name: 'SMKS Kesehatan Fania Salsabila Kota Jambi',
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
};

const defaultAdminUser: UserProfile = {
  id: 'usr-admin-1',
  name: 'Administrator Resmi (SMK Fania)',
  nip: '19850101 201001 1 001',
  role: 'admin',
  roleLabel: 'Administrator Sistem & Data',
  assignedClassIds: [],
  email: 'admin@smkfania.sch.id',
  avatarInitials: 'AF',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultAdminUser);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classAgreements, setClassAgreements] = useState<ClassAgreement[]>([]);
  const [incidentRecords, setIncidentRecords] = useState<IncidentRecord[]>([]);
  const [caseHandlings, setCaseHandlings] = useState<CaseHandling[]>([]);
  const [followUpPlans, setFollowUpPlans] = useState<FollowUpPlan[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(defaultSchoolProfile);
  const [users, setUsers] = useState<UserProfile[]>([defaultAdminUser]);

  // Auth fetch wrapper
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const activeToken = token || localStorage.getItem(TOKEN_STORAGE_KEY);
      const headers = new Headers(options.headers || {});
      if (activeToken) {
        headers.set('Authorization', `Bearer ${activeToken}`);
      }
      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const res = await fetch(url, { credentials: 'same-origin', ...options, headers });
      if (res.status === 401) {
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      return res;
    },
    [token]
  );

  // Helper to get initials
  const getInitials = (fullName: string) => {
    const clean = (fullName || 'Pengguna').replace(/^(Dra\.|Drs\.|Hj\.|H\.)\s*/gi, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0]?.[0] || 'U'}${parts[1]?.[0] || 'P'}`.toUpperCase();
  };

  // Fetch all operational data
  const refreshData = useCallback(async () => {
    try {
      const [
        classesRes,
        studentsRes,
        agreementsRes,
        incidentsRes,
        casesRes,
        plansRes,
        schoolRes,
        usersRes,
        logsRes,
      ] = await Promise.all([
        authFetch('/api/classes'),
        authFetch('/api/students'),
        authFetch('/api/agreements'),
        authFetch('/api/incidents'),
        authFetch('/api/cases'),
        authFetch('/api/plans'),
        authFetch('/api/school'),
        authFetch('/api/users'),
        authFetch('/api/audit-logs'),
      ]);

      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data);
      }
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data);
      }
      if (agreementsRes.ok) {
        const data = await agreementsRes.json();
        setClassAgreements(data);
      }
      if (incidentsRes.ok) {
        const data = await incidentsRes.json();
        setIncidentRecords(data);
      }
      if (casesRes.ok) {
        const data = await casesRes.json();
        setCaseHandlings(data);
      }
      if (plansRes.ok) {
        const data = await plansRes.json();
        setFollowUpPlans(data);
      }
      if (schoolRes.ok) {
        const data = await schoolRes.json();
        setSchoolProfile(data);
      }
      if (usersRes.ok) {
        const rawUsers = await usersRes.json();
        const formattedUsers = rawUsers.map((u: any) => ({
          ...u,
          avatarInitials: getInitials(u.name),
        }));
        setUsers(formattedUsers);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    }
  }, [authFetch]);

  // Initial direct authentication initialization (No login barrier)
  useEffect(() => {
    const initAuth = async () => {
      setIsAuthenticated(true);
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      try {
        const headers: Record<string, string> = {};
        if (savedToken) {
          headers['Authorization'] = `Bearer ${savedToken}`;
        }
        const res = await fetch('/api/auth/me', { headers });

        if (res.ok) {
          const userData = await res.json();
          setCurrentUser({
            id: userData.userId,
            name: userData.name,
            nip: userData.nip || '-',
            role: userData.role,
            roleLabel: userData.roleLabel,
            assignedClassIds: userData.assignedClassIds || [],
            email: userData.email || 'admin@smkfania.sch.id',
            avatarInitials: getInitials(userData.name),
          });
          if (savedToken) setToken(savedToken);
        }
      } catch (err) {
        console.warn('Direct access initialization notice:', err);
      } finally {
        await refreshData();
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshData]);

  // Login handler
  const login = async (username: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Nama pengguna atau kata sandi tidak valid.' };
      }

      const receivedToken = data.token;
      localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
      setToken(receivedToken);
      setIsAuthenticated(true);

      const user = data.user;
      setCurrentUser({
        id: user.userId,
        name: user.name,
        nip: user.nip || '-',
        role: user.role,
        roleLabel: user.roleLabel,
        assignedClassIds: user.assignedClassIds || [],
        email: user.email || `${user.username}@smkfania.sch.id`,
        avatarInitials: getInitials(user.name),
      });

      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Koneksi ke server gagal.' };
    }
  };

  // Logout / Reset session handler (keeps application directly accessible)
  const logout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setCurrentUser(defaultAdminUser);
      setIsAuthenticated(true);
      await refreshData();
    }
  };

  // Role simulation / switching (for testing RBAC perspectives)
  const switchUserRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      // Temporary role simulation
      setCurrentUser((prev) => ({
        ...prev,
        role,
        roleLabel:
          role === 'admin'
            ? 'Administrator Sistem & Data'
            : role === 'wali_kelas'
            ? 'Wali Kelas'
            : role === 'guru_bk'
            ? 'Guru Bimbingan Konseling / Pendamping'
            : 'Kepala Sekolah',
      }));
    }
  };

  // Class Management CRUD
  const addClass = async (classData: Partial<ClassData>): Promise<ClassData> => {
    const res = await authFetch('/api/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menambahkan rombongan belajar.');
    }
    await refreshData();
    return data;
  };

  const updateClass = async (id: string, classData: Partial<ClassData>): Promise<ClassData> => {
    const res = await authFetch(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui rombongan belajar.');
    }
    await refreshData();
    return data;
  };

  const deleteClass = async (id: string, force?: boolean): Promise<void> => {
    const url = `/api/classes/${id}${force ? '?force=true' : ''}`;
    const res = await authFetch(url, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data.error || 'Gagal menghapus rombongan belajar.');
      err.canForce = data.canForce;
      err.studentCount = data.studentCount;
      err.hasAgreements = data.hasAgreements;
      throw err;
    }
    await refreshData();
  };

  // Student CRUD
  const addStudent = async (studentData: Partial<Student>): Promise<Student> => {
    const res = await authFetch('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menambahkan data siswa.');
    }
    await refreshData();
    return data;
  };

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
    const res = await authFetch(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui data siswa.');
    }
    await refreshData();
    return data;
  };

  const deleteStudent = async (id: string): Promise<void> => {
    const res = await authFetch(`/api/students/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghapus data siswa.');
    }
    await refreshData();
  };

  // User CRUD
  const addUser = async (
    userData: Partial<UserProfile> & { password?: string; username?: string }
  ): Promise<UserProfile> => {
    const cleanUsername =
      userData.username ||
      (userData.name || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 10) + Math.floor(Math.random() * 100);

    const payload = {
      username: cleanUsername,
      password: userData.password || '123456',
      name: userData.name || 'Pengguna Baru',
      nip: userData.nip || '-',
      role: userData.role || 'wali_kelas',
      roleLabel: userData.roleLabel,
      email: userData.email,
      assignedClassIds: userData.assignedClassIds || [],
    };

    const res = await authFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mendaftarkan akun pengguna.');
    }

    await refreshData();
    return {
      ...data,
      avatarInitials: getInitials(data.name),
    };
  };

  const updateUser = async (
    id: string,
    updated: Partial<UserProfile> & { password?: string }
  ): Promise<void> => {
    const res = await authFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui data pengguna.');
    }
    await refreshData();
  };

  const deleteUser = async (id: string): Promise<void> => {
    const res = await authFetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghapus pengguna.');
    }
    await refreshData();
  };

  // Class Agreement CRUD
  const createClassAgreement = async (
    agreementData: Partial<ClassAgreement>
  ): Promise<ClassAgreement> => {
    const res = await authFetch('/api/agreements', {
      method: 'POST',
      body: JSON.stringify(agreementData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menyusun kesepakatan kelas.');
    }
    await refreshData();
    return data;
  };

  const updateClassAgreement = async (
    id: string,
    updated: Partial<ClassAgreement>,
    revisionNote?: string
  ): Promise<void> => {
    const res = await authFetch(`/api/agreements/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updated, revisionNote }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui kesepakatan kelas.');
    }
    await refreshData();
  };

  // Incident Records CRUD
  const createIncidentRecord = async (
    recordData: Partial<IncidentRecord>
  ): Promise<IncidentRecord> => {
    const res = await authFetch('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mencatat kejadian faktual.');
    }
    await refreshData();
    return data;
  };

  const updateIncidentStatus = async (
    id: string,
    status: IncidentRecord['status']
  ): Promise<void> => {
    const res = await authFetch(`/api/incidents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui status kejadian.');
    }
    await refreshData();
  };

  // Case Handling CRUD
  const createCaseFromIncident = async (
    incidentId: string,
    assignedOfficerId: string,
    guidanceSummary: string,
    targetDate: string
  ): Promise<CaseHandling> => {
    const res = await authFetch('/api/cases', {
      method: 'POST',
      body: JSON.stringify({
        incidentRecordId: incidentId,
        assignedOfficerId,
        discussionSummary: guidanceSummary,
        targetEvaluationDate: targetDate,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal membuka kasus pendampingan.');
    }
    await refreshData();
    return data;
  };

  const addCaseProgressNote = async (
    caseId: string,
    note: string,
    studentResponse: string,
    nextCheckDate?: string
  ): Promise<void> => {
    const res = await authFetch(`/api/cases/${caseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ note, studentResponse, nextCheckDate }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menambahkan catatan perkembangan.');
    }
    await refreshData();
  };

  const updateCaseStatus = async (
    caseId: string,
    status: CaseHandling['status'],
    resolutionSummary?: string
  ): Promise<void> => {
    const res = await authFetch(`/api/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolutionSummary }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui status kasus.');
    }
    await refreshData();
  };

  // Follow-up Plans (RTL)
  const createFollowUpPlan = async (
    planData: Partial<FollowUpPlan>
  ): Promise<FollowUpPlan> => {
    const res = await authFetch('/api/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menjadwalkan rencana tindak lanjut.');
    }
    await refreshData();
    return data;
  };

  const updateFollowUpPlanStatus = async (
    id: string,
    status: FollowUpPlan['status']
  ): Promise<void> => {
    const res = await authFetch(`/api/plans/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui status RTL.');
    }
    await refreshData();
  };

  const deleteFollowUpPlan = async (id: string): Promise<void> => {
    const res = await authFetch(`/api/plans/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghapus RTL.');
    }
    await refreshData();
  };

  // School Profile & Config
  const updateSchoolProfile = async (profile: Partial<SchoolProfile>): Promise<void> => {
    const res = await authFetch('/api/school', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal memperbarui profil sekolah.');
    }
    setSchoolProfile(data);
  };

  const testSpreadsheetConnection = async (webhookUrl: string, spreadsheetId?: string): Promise<any> => {
    const res = await authFetch('/api/spreadsheet/test-connection', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl, spreadsheetId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menguji koneksi Webhook.');
    }
    return data;
  };

  const syncClassesToSpreadsheet = async (webhookUrl?: string, spreadsheetId?: string): Promise<any> => {
    const res = await authFetch('/api/spreadsheet/sync-classes', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl, spreadsheetId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal sinkronisasi data kelas ke Google Spreadsheet.');
    }
    return data;
  };

  const syncUsersToSpreadsheet = async (webhookUrl?: string, spreadsheetId?: string): Promise<any> => {
    const res = await authFetch('/api/spreadsheet/sync-users', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl, spreadsheetId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal sinkronisasi data pengguna ke Google Spreadsheet.');
    }
    return data;
  };

  const syncAllToSpreadsheet = async (webhookUrl?: string, spreadsheetId?: string): Promise<any> => {
    const res = await authFetch('/api/spreadsheet/sync-all', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl, spreadsheetId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal sinkronisasi data ke Google Spreadsheet.');
    }
    return data;
  };

  // Demo Seeding & Clearing
  const seedDemoData = async (): Promise<void> => {
    const res = await authFetch('/api/system/seed-demo', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menambahkan data simulasi DEMO.');
    }
    await refreshData();
  };

  const clearDemoData = async (): Promise<void> => {
    const res = await authFetch('/api/system/clear-demo', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal membersihkan data DEMO.');
    }
    await refreshData();
  };

  const resetToDefaultData = () => {
    clearDemoData().catch(console.error);
  };

  const addAuditLog = (action: string, resourceType: string, resourceId: string, summary: string) => {
    // Audit logs are automatically managed server-side via backend route calls
    console.log(`[Audit] ${action} on ${resourceType}:${resourceId} - ${summary}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        classes,
        students,
        classAgreements,
        incidentRecords,
        caseHandlings,
        followUpPlans,
        auditLogs,
        schoolProfile,
        users,
        isAuthenticated,
        isLoading,
        activeTab,
        setActiveTab,
        login,
        logout,
        addClass,
        updateClass,
        deleteClass,
        addStudent,
        updateStudent,
        deleteStudent,
        addUser,
        updateUser,
        deleteUser,
        createClassAgreement,
        updateClassAgreement,
        createIncidentRecord,
        updateIncidentStatus,
        addCaseProgressNote,
        updateCaseStatus,
        createCaseFromIncident,
        createFollowUpPlan,
        updateFollowUpPlanStatus,
        deleteFollowUpPlan,
        updateSchoolProfile,
        testSpreadsheetConnection,
        syncClassesToSpreadsheet,
        syncUsersToSpreadsheet,
        syncAllToSpreadsheet,
        seedDemoData,
        clearDemoData,
        refreshData,
        addAuditLog,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
