
import { Patient } from '../types';

/**
 * CONFIGURAÇÃO INTERX HEALTH - SUPABASE
 * Chaves extraídas do print do painel de controle.
 */
const SUPABASE_URL = 'https://ylbavbgzwfoyglgeozpg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2x_y5-M_JHQ79-Vxi8oMRg_vNyMryiu';

const isCloudActive = SUPABASE_KEY && SUPABASE_KEY.length > 20;

export const databaseService = {
  status: () => isCloudActive ? 'cloud' : 'local',

  getPatients: async (): Promise<Patient[]> => {
    try {
      if (!isCloudActive) return JSON.parse(localStorage.getItem('pacientes_logistica_data') || '[]');

      const response = await fetch(`${SUPABASE_URL}/rest/v1/patients?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro na nuvem');
      }
      
      const data = await response.json();
      
      return data.map((p: any) => ({
        id: p.id,
        numeroConhecimento: p.numero_conhecimento,
        nomePaciente: p.nome_paciente,
        dataEnvio: p.data_envio,
        destino: p.destino,
        dataRecebimento: p.data_recebimento,
        observacao: p.observacao,
        createdAt: new Date(p.created_at).getTime()
      }));
    } catch (e) {
      console.warn("Modo Offline/Erro:", e);
      return JSON.parse(localStorage.getItem('pacientes_logistica_data') || '[]');
    }
  },

  savePatient: async (patient: Patient): Promise<boolean> => {
    try {
      // Backup Local
      const localData = JSON.parse(localStorage.getItem('pacientes_logistica_data') || '[]');
      const idx = localData.findIndex((p: any) => p.id === patient.id);
      if (idx !== -1) localData[idx] = patient; else localData.push(patient);
      localStorage.setItem('pacientes_logistica_data', JSON.stringify(localData));

      if (!isCloudActive) return true;

      const payload = {
        id: patient.id,
        numero_conhecimento: patient.numeroConhecimento,
        nome_paciente: patient.nomePaciente,
        data_envio: patient.dataEnvio,
        destino: patient.destino,
        data_recebimento: patient.dataRecebimento,
        observacao: patient.observacao
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/patients`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (e) {
      console.error("Erro na transação:", e);
      return false;
    }
  },

  deletePatient: async (id: string): Promise<boolean> => {
    try {
      // 1. Limpa o LocalStorage primeiro para resposta imediata
      const localData = JSON.parse(localStorage.getItem('pacientes_logistica_data') || '[]');
      const filtered = localData.filter((p: any) => p.id !== id);
      localStorage.setItem('pacientes_logistica_data', JSON.stringify(filtered));

      // 2. Se não houver nuvem, já terminou
      if (!isCloudActive) return true;

      // 3. Tenta deletar na Nuvem
      const response = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      // Mesmo se o servidor falhar (ex: 401), retornamos true porque o local foi limpo.
      // A UI vai refletir o sumiço do item.
      return true;
    } catch (e) {
      console.error("Erro ao deletar remoto:", e);
      return true; // Retorna true para permitir que a UI continue limpa localmente
    }
  }
};
