import { mockReferencias } from './mocks';
import { VariaveisReferencia } from './types';

/**
 * Serviço de Fachada para obtenção de benchmarks e potenciais.
 * Simula a busca de parâmetros de mercado baseados no sistema de produção.
 * * @param sistemaProducao - O sistema utilizado (ex: "Pasto", "Confinamento").
 * @returns Promise com as variáveis de referência para o sistema solicitado.
 */
export async function fetchVariaveisReferencia(
  sistemaProducao: string
): Promise<VariaveisReferencia> {

  // Simulação de latência de banco de dados (1 segundo)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tenta encontrar o sistema específico ou retorna o padrão
      const refs = mockReferencias[sistemaProducao] || mockReferencias["Padrao"];
      
      console.log(`[API Variáveis] Carregando potenciais para sistema: ${sistemaProducao}`);
      resolve(refs);
    }, 1000);
  });
}