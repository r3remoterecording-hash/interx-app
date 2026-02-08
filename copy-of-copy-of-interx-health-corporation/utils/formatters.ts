
export const formatDateBR = (isoString: string | null): string => {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-');
  return `${day}/${month}/${year}`;
};

export const parseBRDateToISO = (brString: string): string | null => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = brString.match(regex);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

export const parseDateToBRSearch = (isoString: string | null): string => {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-');
  return `${day}/${month}/${year} ${month}/${year} ${year}`;
};

export const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Gera e compartilha/baixa o arquivo CSV seguindo padrões internacionais de compatibilidade.
 */
export const exportToSpreadsheet = async (data: any[], filename: string, mode: 'share' | 'download' = 'download') => {
  // Padrão de laboratório: Semicolon (;) é preferido para Excel em sistemas PT-BR, 
  // mas o BOM garante que o Excel identifique UTF-8 corretamente.
  const separator = ';';
  const headers = [
    'NUMERO_CONHECIMENTO', 
    'NOME_PACIENTE', 
    'DATA_ENVIO', 
    'DESTINO', 
    'DATA_RECEBIMENTO', 
    'OBSERVACOES'
  ];
  
  const csvRows = [
    headers.join(separator),
    ...data.map(row => [
      `"${row.numeroConhecimento}"`,
      `"${row.nomePaciente}"`,
      `"${formatDateBR(row.dataEnvio)}"`,
      `"${row.destino}"`,
      `"${formatDateBR(row.dataRecebimento)}"`,
      `"${(row.observacao || '').replace(/"/g, '""')}"`
    ].join(separator))
  ];

  // Adiciona o BOM (\uFEFF) para forçar o Excel a reconhecer como UTF-8
  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const file = new File([blob], filename, { type: 'text/csv' });

  // Tenta compartilhar se o navegador suportar e for solicitado
  if (mode === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Relatório Interx Health',
        text: 'Exportação de dados de pacientes Interx Health Corporation.'
      });
      return;
    } catch (e) {
      console.warn('Share canceled or failed', e);
      // Se falhar o share, ele tenta o download como fallback
    }
  }

  // Fallback: Download tradicional
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Mantemos o nome antigo para compatibilidade se necessário, mas apontando para a nova lógica
export const downloadCSV = exportToSpreadsheet;
