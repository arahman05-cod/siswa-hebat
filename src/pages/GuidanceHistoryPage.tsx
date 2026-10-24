import React, { useState } from 'react';
import {
  History,
  Search,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  HeartHandshake,
  Shield,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuidanceHistoryPage: React.FC = () => {
  const { caseHandlings, incidentRecords, classes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Flatten all progress notes and guidance actions into a unified chronological log
  const timelineEvents: Array<{
    id: string;
    date: string;
    time: string;
    studentName: string;
    className: string;
    caseNumber: string;
    officerName: string;
    officerRole: string;
    note: string;
    studentResponse?: string;
    type: 'sesi_konseling' | 'evaluasi_target' | 'komunikasi_orangtua';
  }> = [];

  caseHandlings.forEach((c) => {
    c.progressNotes.forEach((pn) => {
      timelineEvents.push({
        id: pn.id,
        date: pn.date,
        time: pn.time,
        studentName: c.studentName,
        className: c.className,
        caseNumber: c.caseNumber,
        officerName: pn.officerName,
        officerRole: pn.officerRole,
        note: pn.note,
        studentResponse: pn.studentResponse,
        type: 'sesi_konseling',
      });
    });

    if (c.parentCommunication.conducted && c.parentCommunication.date) {
      timelineEvents.push({
        id: `pcomm-${c.id}`,
        date: c.parentCommunication.date,
        time: '10:00 WIB',
        studentName: c.studentName,
        className: c.className,
        caseNumber: c.caseNumber,
        officerName: c.assignedOfficerName,
        officerRole: c.assignedOfficerRole,
        note: `Komunikasi dengan orang tua/wali via ${c.parentCommunication.method}: ${c.parentCommunication.notes}`,
        type: 'komunikasi_orangtua',
      });
    }
  });

  // Sort chronological descending
  timelineEvents.sort((a, b) => (a.date < b.date ? 1 : -1));

  const filteredEvents = timelineEvents.filter((ev) => {
    const matchesClass =
      selectedClassFilter === 'all' ||
      classes.find((c) => c.name === ev.className)?.id === selectedClassFilter;
    const matchesSearch =
      ev.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.note.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Riwayat & Linimasa Pendampingan Siswa</h2>
          <p className="text-xs text-slate-500">
            Jejak kronologis sesi pembimbingan, komunikasi suportif dengan wali, dan evaluasi berkala
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa, catatan sesi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Kelas:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Rombongan Belajar</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Belum ada catatan riwayat pendampingan yang sesuai.
          </div>
        ) : (
          <div className="relative border-l-2 border-teal-500/40 ml-4 space-y-6 pl-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative group">
                {/* Node dot */}
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-teal-600 ring-4 ring-white" />

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:bg-white hover:shadow-xs transition-all space-y-2 text-xs">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {event.className}
                      </span>
                      <strong className="text-slate-900 text-xs">{event.studentName}</strong>
                      <span className="font-mono text-slate-400 text-[11px]">
                        ({event.caseNumber})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                    </div>
                  </div>

                  {/* Body note */}
                  <p className="text-slate-700 leading-relaxed">{event.note}</p>

                  {/* Student Response */}
                  {event.studentResponse && (
                    <div className="rounded-lg bg-teal-50 p-2.5 text-[11px] text-teal-900 border border-teal-100">
                      <span className="font-bold">Respon Peserta Didik:</span> "
                      {event.studentResponse}"
                    </div>
                  )}

                  {/* Footer Petugas */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Petugas:{' '}
                      <strong className="text-slate-700">{event.officerName}</strong> (
                      {event.officerRole})
                    </span>
                    <span className="font-medium text-teal-700">Terdokumentasi Resmi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
