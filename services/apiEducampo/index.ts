import { 
  mockTrabalhador, 
  mockHectare, 
  mockProdutividade, 
  mockCcs 
} from './mocks';
import { DiagramaSaida, ModelInput } from './types';

/**
 * Serviço de Fachada (Facade) para a API Educampo.
 * Simula a chamada à LLM para obter o diagnóstico de Ishikawa.
 * * @param tipoAnalise - O foco do diagnóstico ('ccs', 'hectare', 'trabalhador', 'produtividade').
 * @param input - Os dados atuais da fazenda para processamento.
 * @returns Promise com o Diagrama de Ishikawa estruturado.
 */
export async function fetchDiagnostico(
  tipoAnalise: 'ccs' | 'hectare' | 'trabalhador' | 'produtividade',
  input: ModelInput
): Promise<DiagramaSaida> {
  
  // Simulação de latência de rede e processamento da IA (2 segundos)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[API Educampo] Diagnosticando ${tipoAnalise} para: ${input.nome_fazenda}`);
      
      switch (tipoAnalise) {
        case 'trabalhador':
          resolve(mockTrabalhador);
          break;
        case 'hectare':
          resolve(mockHectare);
          break;
        case 'produtividade':
          resolve(mockProdutividade);
          break;
        case 'ccs':
          resolve(mockCcs);
          break;
        default:
          resolve(mockTrabalhador);
      }
    }, 2000);
  });
}