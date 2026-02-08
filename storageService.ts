
import { Patient } from '../types';

const STORAGE_KEY = 'pacientes_logistica_data';

export const storageService = {
  getPatients: (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  savePatients: (patients: Patient[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  },

  addPatient: (patient: Patient) => {
    const patients = storageService.getPatients();
    patients.push(patient);
    storageService.savePatients(patients);
  },

  updatePatient: (updatedPatient: Patient) => {
    const patients = storageService.getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      patients[index] = updatedPatient;
      storageService.savePatients(patients);
    }
  },

  deletePatient: (id: string) => {
    const patients = storageService.getPatients();
    const filtered = patients.filter(p => p.id !== id);
    storageService.savePatients(filtered);
  },

  // Exporta todo o banco de dados para um arquivo
  exportFullBackup: () => {
    const data = localStorage.getItem(STORAGE_KEY) || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup-interx-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Importa dados de um arquivo e mescla com os atuais
  importBackup: (jsonContent: string): boolean => {
    try {
      const importedData = JSON.parse(jsonContent);
      if (Array.isArray(importedData)) {
        const currentData = storageService.getPatients();
        // Evita duplicatas comparando IDs
        const existingIds = new Set(currentData.map(p => p.id));
        const newData = importedData.filter(p => !existingIds.has(p.id));
        
        storageService.savePatients([...currentData, ...newData]);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro na importação:", e);
      return false;
    }
  }
};
