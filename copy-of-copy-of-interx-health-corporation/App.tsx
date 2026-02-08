
import React, { useState, useEffect, useMemo } from 'react';
import { Patient, SortConfig, SortField } from './types';
import { databaseService } from './services/databaseService';
import { authService, User } from './services/authService';
import { formatDateBR, exportToSpreadsheet } from './utils/formatters';
import PatientForm from './components/PatientForm';
import PatientTable from './components/PatientTable';
import Login from './components/Login';

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
    const data = await databaseService.getPatients();
    setPatients(data);
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.reload();
  };

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return patients;

    return patients.filter(p => {
      // Prepara strings de data para busca (formato BR)
      const envioBR = formatDateBR(p.dataEnvio);
      const recebBR = p.dataRecebimento ? formatDateBR(p.dataRecebimento) : 'pendente';
      
      // Cria um "pool" de busca com todos os campos relevantes
      const searchStr = [
        p.numeroConhecimento,
        p.nomePaciente,
        p.destino,
        p.observacao || '',
        envioBR,
        recebBR
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
    setPatients(prev => prev.filter(p => p.id !== patientToDelete));
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
    setLoading(false);
  };

  if (!user) return <Login onLoginSuccess={(u) => setUser(u)} />;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans text-white">
      {/* HEADER iOS STYLE */}
      <header className="px-5 pt-[env(safe-area-inset-top,20px)] pb-5 bg-black/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-4 mt-2">
          <div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <h1 className="text-xl font-black italic tracking-tighter">INTERX HEALTH</h1>
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{user.name}</p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-full text-red-500 active:scale-90 transition-all border border-red-500/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
          </button>
        </div>
        
        {/* BARRA DE AÇÕES */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, N. Conhecimento, data ou observação..."
              className="w-full h-12 bg-white/10 rounded-xl pl-11 pr-4 text-[16px] outline-none placeholder:text-white/20 font-semibold text-white focus:bg-white/[0.15] transition-all border border-white/5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => exportToSpreadsheet(patients, 'INTERX-RELATORIO.csv')}
              className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 active:bg-white/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest">Planilha</span>
            </button>

            <button
              onClick={() => { setEditingPatient(null); setIsFormOpen(true); }}
              className="flex-1 h-12 bg-white text-black rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest">Cadastro</span>
            </button>
          </div>
        </div>
      </header>

      {/* LISTA DE PACIENTES */}
      <main className="flex-1 overflow-y-auto px-5 py-6 pb-20 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Base de Dados</h2>
            <span className="text-[9px] font-bold px-2.5 py-1 bg-white/5 text-white/40 rounded-full border border-white/5">
              {filteredPatients.length} Registros Encontrados
            </span>
          </div>
          
          <PatientTable
            patients={filteredPatients}
            onEdit={(p) => { setEditingPatient(p); setIsFormOpen(true); }}
            onDelete={confirmDelete}
            sortConfig={{field: 'createdAt', direction: 'desc'}}
            onSort={() => {}}
          />
          
          {loading && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 animate-pulse">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Sincronizando...</p>
            </div>
          )}
        </div>
      </main>

      {/* COMPONENTES MODAIS */}
      {isFormOpen && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-6 backdrop-blur-xl">
          <div className="bg-[#1c1c1e] w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-center mb-1 text-white italic">EXCLUIR?</h3>
            <p className="text-[10px] text-center text-white/30 uppercase tracking-[0.2em] font-bold mb-8 leading-relaxed">Este registro será removido permanentemente.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full h-14 bg-red-500 rounded-2xl text-[10px] font-black uppercase text-white active:scale-95 transition-all">Sim, Excluir</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full h-14 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-white/40 active:scale-95 transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
