
import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { generateId } from '../utils/formatters';

interface PatientFormProps {
  patient?: Patient | null;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    numeroConhecimento: '',
    nomePaciente: '',
    dataEnvio: new Date().toISOString().split('T')[0],
    destino: '',
    dataRecebimento: '',
    observacao: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        numeroConhecimento: patient.numeroConhecimento,
        nomePaciente: patient.nomePaciente,
        dataEnvio: patient.dataEnvio,
        destino: patient.destino,
        dataRecebimento: patient.dataRecebimento || '',
        observacao: patient.observacao || ''
      });
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: patient?.id || generateId(),
      numeroConhecimento: formData.numeroConhecimento,
      nomePaciente: formData.nomePaciente.toUpperCase(),
      dataEnvio: formData.dataEnvio,
      destino: formData.destino.toUpperCase(),
      dataRecebimento: formData.dataRecebimento || null,
      observacao: formData.observacao.trim() || undefined,
      createdAt: patient?.createdAt || Date.now()
    };
    onSave(newPatient);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#1c1c1e] w-full max-w-lg mx-auto rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom duration-500 border-t md:border border-white/10">
        
        {/* INDICADOR iOS */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/10 rounded-full"></div>
        </div>

        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5">
          <h2 className="text-xl font-black text-white tracking-tight italic">
            {patient ? 'EDITAR' : 'NOVO REGISTRO'}
          </h2>
          <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto pb-12">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Nome do Paciente</label>
              <input
                type="text"
                required
                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white outline-none focus:border-white/20 transition-all font-bold"
                placeholder="Ex: JOÃO SILVA"
                value={formData.nomePaciente}
                onChange={e => setFormData({ ...formData, nomePaciente: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Conhecimento</label>
                <input
                  type="text"
                  required
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white outline-none focus:border-white/20 transition-all font-mono font-bold"
                  value={formData.numeroConhecimento}
                  onChange={e => setFormData({ ...formData, numeroConhecimento: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Destino</label>
                <input
                  type="text"
                  required
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white outline-none focus:border-white/20 transition-all font-bold"
                  value={formData.destino}
                  onChange={e => setFormData({ ...formData, destino: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Data Envio</label>
                <input
                  type="date"
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white outline-none font-bold"
                  value={formData.dataEnvio}
                  onChange={e => setFormData({ ...formData, dataEnvio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Recebimento</label>
                <input
                  type="date"
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-white outline-none font-bold"
                  value={formData.dataRecebimento}
                  onChange={e => setFormData({ ...formData, dataRecebimento: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 ml-1">Notas Internas</label>
              <textarea
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none min-h-[100px] resize-none font-medium"
                value={formData.observacao}
                onChange={e => setFormData({ ...formData, observacao: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="w-full h-16 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;