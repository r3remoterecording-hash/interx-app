import React, { useState, useEffect, useMemo } from 'react';
import { Patient } from './types';
import { databaseService } from './databaseService';
import { authService, User } from './authService';
import { formatDateBR, exportToSpreadsheet } from './formatters';
import PatientForm from './PatientForm';
import PatientTable from './PatientTable';
import Login from './Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await databaseService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return patients;

    return patients.filter(p => {
      const searchStr = [
        p.numeroConhecimento,
        p.nomePaciente,
        p.destino,
        p.observacao || '',
        formatDateBR(p.dataEnvio),
        p.dataRecebimento ? formatDateBR(p.dataRecebimento) : 'pendente'
      ].join(' ').toLowerCase();
      return searchStr.includes(term);
    });
  }, [patients, searchTerm]);

  const handleSave = async (patient: Patient) => {
    setLoading(true);
    await databaseService.savePatient(patient);
    await fetchData();
    setIsFormOpen(false);
    setEditingPatient(null);
    setLoading(false);
  };

  const confirmDelete = (id: string) => {
    setPatientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!patientToDelete) return;
    setLoading(true);
    await databaseService.deletePatient(patientToDelete);
    await fetchData();
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
    setLoading(false);
  };

  if (!user) return <Login onLoginSuccess={(u) => { setUser(u); fetchData(); }} />;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans text-white">
      <header className="px-5 pt-8 pb-5 bg-black/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <h1 className="text-xl font-black italic tracking-tighter">INTERX HEALTH</h1>
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{user.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 rounded-full text-red-500 border border-red-500/10 text-[10px] font-black uppercase">
            Sair
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Pesquisar paciente, destino ou n. conhecimento..."
            className="w-full h-12 bg-white/10 rounded-xl px-4 text-[16px] outline-none placeholder:text-white/20 font-semibold text-white border border-white/5 focus:border-white/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={() => exportToSpreadsheet(patients, 'INTERX-RELATORIO.csv')} className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60">
              <span className="text-[10px] font-black uppercase tracking-widest">Baixar Planilha</span>
            </button>
            <button onClick={() => { setEditingPatient(null); setIsFormOpen(true); }} className="flex-1 h-12 bg-white text-black rounded-xl flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Novo Cadastro</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-6 pb-24 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Registros Logísticos</h2>
            <span className="text-[9px] font-bold px-2.5 py-1 bg-white/5 text-white/40 rounded-full border border-white/5">{filteredPatients.length} Itens</span>
          </div>
          <PatientTable patients={filteredPatients} onEdit={(p) => { setEditingPatient(p); setIsFormOpen(true); }} onDelete={confirmDelete} sortConfig={{field: 'createdAt', direction: 'desc'}} onSort={() => {}} />
          {loading && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <p className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Atualizando...</p>
            </div>
          )}
        </div>
      </main>
      {isFormOpen && <PatientForm patient={editingPatient} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-6 backdrop-blur-xl">
          <div className="bg-[#1c1c1e] w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 text-center">
            <h3 className="text-xl font-black mb-2 text-white italic">EXCLUIR REGISTRO?</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full h-14 bg-red-500 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-red-500/20">Confirmar Exclusão</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full h-14 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-white/40">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;