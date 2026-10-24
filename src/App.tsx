import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ClassDataPage } from './pages/ClassDataPage';
import { ClassAgreementPage } from './pages/ClassAgreementPage';
import { IncidentRecordsPage } from './pages/IncidentRecordsPage';
import { CaseHandlingPage } from './pages/CaseHandlingPage';
import { GuidanceHistoryPage } from './pages/GuidanceHistoryPage';
import { FollowUpPlanPage } from './pages/FollowUpPlanPage';
import { ReportsArchivePage } from './pages/ReportsArchivePage';
import { UsersPermissionsPage } from './pages/UsersPermissionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

// Modals
import { ClassAgreementModal } from './components/modals/ClassAgreementModal';
import { AgreementDocumentPreviewModal } from './components/modals/AgreementDocumentPreviewModal';
import { IncidentRecordModal } from './components/modals/IncidentRecordModal';
import { IncidentDetailModal } from './components/modals/IncidentDetailModal';
import { CreateCaseModal } from './components/modals/CreateCaseModal';
import { CaseDetailModal } from './components/modals/CaseDetailModal';

import { ClassAgreement, IncidentRecord, CaseHandling } from './types';
import {
  LayoutDashboard,
  GraduationCap,
  ScrollText,
  FileSpreadsheet,
  Menu,
  Settings,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab, setActiveTab, classAgreements, incidentRecords, caseHandlings, schoolProfile } =
    useApp();

  // If user is not authenticated yet, show Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Mobile sidebar state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [agreementInitialClassId, setAgreementInitialClassId] = useState<string | undefined>(undefined);
  const [editingAgreement, setEditingAgreement] = useState<ClassAgreement | null>(null);

  const [previewAgreementModalOpen, setPreviewAgreementModalOpen] = useState(false);
  const [previewingAgreement, setPreviewingAgreement] = useState<ClassAgreement | null>(null);

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [viewingIncident, setViewingIncident] = useState<IncidentRecord | null>(null);

  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);
  const [incidentForNewCase, setIncidentForNewCase] = useState<IncidentRecord | null>(null);

  const [viewingCase, setViewingCase] = useState<CaseHandling | null>(null);

  // Handlers
  const handleOpenNewAgreement = (classId?: string) => {
    setEditingAgreement(null);
    setAgreementInitialClassId(classId);
    setAgreementModalOpen(true);
  };

  const handleEditAgreement = (agreement: ClassAgreement) => {
    setEditingAgreement(agreement);
    setAgreementModalOpen(true);
  };

  const handlePreviewAgreement = (agreement: ClassAgreement) => {
    setPreviewingAgreement(agreement);
    setPreviewAgreementModalOpen(true);
  };

  const handleOpenIncidentDetail = (record: IncidentRecord) => {
    setViewingIncident(record);
  };

  const handleOpenCaseFormFromIncident = (incident: IncidentRecord) => {
    setIncidentForNewCase(incident);
    setCreateCaseModalOpen(true);
  };

  const handleOpenCaseDetail = (caseData: CaseHandling) => {
    setViewingCase(caseData);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)} />

        {/* Page Container */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenNewAgreement={() => handleOpenNewAgreement()}
              onOpenNewIncident={() => setIncidentModalOpen(true)}
            />
          )}

          {activeTab === 'data-kelas' && (
            <ClassDataPage
              onOpenNewAgreement={(classId) => handleOpenNewAgreement(classId)}
              onViewAgreement={(agrId) => {
                const agr = classAgreements.find((a) => a.id === agrId);
                if (agr) handlePreviewAgreement(agr);
              }}
            />
          )}

          {activeTab === 'kesepakatan-kelas' && (
            <ClassAgreementPage
              onOpenNewAgreement={(classId) => handleOpenNewAgreement(classId)}
              onEditAgreement={handleEditAgreement}
              onPreviewAgreement={handlePreviewAgreement}
            />
          )}

          {activeTab === 'catatan-kejadian' && (
            <IncidentRecordsPage
              onOpenNewIncident={() => setIncidentModalOpen(true)}
              onViewIncidentDetail={handleOpenIncidentDetail}
              onOpenCaseForm={handleOpenCaseFormFromIncident}
            />
          )}

          {activeTab === 'penanganan-kasus' && (
            <CaseHandlingPage onViewCaseDetail={handleOpenCaseDetail} />
          )}

          {activeTab === 'riwayat-pendampingan' && <GuidanceHistoryPage />}

          {activeTab === 'rencana-tindak-lanjut' && <FollowUpPlanPage />}

          {activeTab === 'laporan-arsip' && <ReportsArchivePage />}

          {activeTab === 'pengguna-hak-akses' && <UsersPermissionsPage />}

          {activeTab === 'pengaturan-aplikasi' && <SettingsPage />}
        </main>

        {/* Modern Mobile Bottom Navigation Bar */}
        <nav
          aria-label="Navigasi Cepat Seluler"
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-md shadow-lg"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('data-kelas')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'data-kelas' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-[10px]">Kelas</span>
          </button>

          <button
            onClick={() => setActiveTab('kesepakatan-kelas')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'kesepakatan-kelas' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScrollText className="h-5 w-5" />
            <span className="text-[10px]">Kesepakatan</span>
          </button>

          <button
            onClick={() => setActiveTab('catatan-kejadian')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'catatan-kejadian' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span className="text-[10px]">Kejadian</span>
          </button>

          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>

      {/* Global Application Modals */}
      <ClassAgreementModal
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
        initialClassId={agreementInitialClassId}
        editingAgreement={editingAgreement}
      />

      <AgreementDocumentPreviewModal
        isOpen={previewAgreementModalOpen}
        onClose={() => setPreviewAgreementModalOpen(false)}
        agreement={previewingAgreement}
        schoolProfile={schoolProfile}
      />

      <IncidentRecordModal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
      />

      <IncidentDetailModal
        isOpen={!!viewingIncident}
        onClose={() => setViewingIncident(null)}
        record={viewingIncident}
        onOpenCaseForm={handleOpenCaseFormFromIncident}
      />

      <CreateCaseModal
        isOpen={createCaseModalOpen}
        onClose={() => setCreateCaseModalOpen(false)}
        incident={incidentForNewCase}
      />

      <CaseDetailModal
        isOpen={!!viewingCase}
        onClose={() => setViewingCase(null)}
        caseData={
          viewingCase
            ? caseHandlings.find((c) => c.id === viewingCase.id) || viewingCase
            : null
        }
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
