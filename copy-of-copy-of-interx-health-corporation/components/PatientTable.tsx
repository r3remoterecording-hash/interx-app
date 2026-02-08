
import React from 'react';
import { Patient, SortConfig, SortField } from '../types';
import { formatDateBR } from '../utils/formatters';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onEdit, onDelete, sortConfig, onSort }) => {
  return (
    <div className="space-y-4">
      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        {patients.length === 0 ? (
          <div className="py-20 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.4em]">Nenhum registro encontrado</div>
        ) : (
          patients.map((p) => (
            <div key={p.id} className="ios-card rounded-3xl overflow-hidden border border-white/10 shadow-lg">
              <div className="p-5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-400/20">
                        N. Conhecimento: {p.numeroConhecimento}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white truncate leading-tight tracking-tight">
                      {p.nomePaciente}
                    </h3>
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mt-1">
                      {p.destino}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onEdit(p)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/60 active:bg-white/10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => onDelete(p.id)} className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-full text-red-500 active:bg-red-500 active:text-white">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Envio</span>
                    <p className="text-xs font-mono font-bold text-white/80">{formatDateBR(p.dataEnvio)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Recebimento</span>
                    <p className={`text-xs font-mono font-bold ${p.dataRecebimento ? 'text-emerald-400' : 'text-amber-500/50'}`}>
                      {p.dataRecebimento ? formatDateBR(p.dataRecebimento) : 'Pendente'}
                    </p>
                  </div>
                </div>
              </div>
              
              {p.observacao && (
                <div className="px-5 py-3 bg-black/40 border-t border-white/5">
                  <p className="text-[10px] text-white/30 italic leading-relaxed line-clamp-2">{p.observacao}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block ios-card rounded-3xl overflow-hidden border border-white/10">
        <table className="w-full text-left border-collapse table-auto">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Paciente</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Conhecimento</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Envio</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Recebimento</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Destino</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Observação</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-[10px] font-black uppercase text-white/10 tracking-[0.5em]">Nenhum registro encontrado</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">{p.nomePaciente}</td>
                  <td className="px-6 py-4 text-sm font-mono text-white/40 whitespace-nowrap">{p.numeroConhecimento}</td>
                  <td className="px-6 py-4 text-sm font-mono text-white/60 whitespace-nowrap">{formatDateBR(p.dataEnvio)}</td>
                  <td className={`px-6 py-4 text-sm font-mono whitespace-nowrap ${p.dataRecebimento ? 'text-emerald-400 font-bold' : 'text-white/20'}`}>
                    {p.dataRecebimento ? formatDateBR(p.dataRecebimento) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">{p.destino}</td>
                  <td className="px-6 py-4 text-xs text-white/30 italic max-w-xs truncate" title={p.observacao}>
                    {p.observacao || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(p)} className="text-[10px] font-black uppercase text-white/20 hover:text-white">Editar</button>
                      <button onClick={() => onDelete(p.id)} className="text-[10px] font-black uppercase text-white/20 hover:text-red-500">Apagar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
