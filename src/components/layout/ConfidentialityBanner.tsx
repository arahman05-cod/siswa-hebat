import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const ConfidentialityBanner: React.FC = () => {
  return (
    <div className="no-print mb-6 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/90 via-slate-50/80 to-teal-50/40 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-teal-600/10 p-2 text-teal-800 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Prinsip Restoratif & Kerahasiaan Data Siswa
              </h4>
              <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-900 uppercase">
                Kerahasiaan Terlindungi
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Sistem ini dirancang untuk mendokumentasikan fakta secara objektif tanpa label penghakiman,
              membangun pemulihan hubungan, dan mendampingi siswa secara bermartabat. Seluruh data fiktif
              dan catatan dilindungi dengan pembatasan hak akses berbasis peran.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          <Info className="h-3.5 w-3.5 text-teal-600" />
          <span>Non-Punitive & Confidental</span>
        </div>
      </div>
    </div>
  );
};
