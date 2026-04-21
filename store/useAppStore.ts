import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DiagramaSaida, ModelInput } from '@/services/apiEducampo/types';
import { VariaveisReferencia } from '@/services/apiVariaveis/types';

/**
 * Interface que define o estado global da aplicação.
 * Organizado para persistir dados entre a tela de Carregamento e a Dashboard.
 */
interface AppState {
  /** Dados cadastrais da fazenda (recuperados no login ou configurações) */
  dadosFazenda: ModelInput | null;
  
  /** Resultados dos 4 diagnósticos de Ishikawa processados pela API */
  diagnosticos: {
    trabalhador: DiagramaSaida | null;
    hectare: DiagramaSaida | null;
    produtividade: DiagramaSaida | null;
    ccs: DiagramaSaida | null;
  };
  
  /** Variáveis de potencial e benchmark baseadas no sistema de produção */
  referencias: VariaveisReferencia | null;
  
  /** Flag que indica se todos os dados necessários para a Dashboard estão carregados */
  isLoaded: boolean;

  // --- Ações (Actions) ---

  /** Atualiza os dados da fazenda e reseta o status de carregamento */
  setDadosFazenda: (dados: ModelInput) => void;
  
  /** Salva o resultado de um diagnóstico específico */
  setDiagnostico: (tipo: keyof AppState['diagnosticos'], data: DiagramaSaida) => void;
  
  /** Define as variáveis de referência de potencial */
  setReferencias: (refs: VariaveisReferencia) => void;
  
  /** Altera o status de prontidão do sistema */
  setLoaded: (status: boolean) => void;
  
  /** Limpa todo o estado (Logout) */
  reset: () => void;
}

/**
 * Store principal da aplicação usando Zustand.
 * Utiliza o middleware 'persist' para salvar os dados no sessionStorage,
 * garantindo que o usuário não perca os dados da IA ao dar F5 na Dashboard.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      dadosFazenda: null,
      diagnosticos: {
        trabalhador: null,
        hectare: null,
        produtividade: null,
        ccs: null,
      },
      referencias: null,
      isLoaded: false,

      setDadosFazenda: (dados) => set({ dadosFazenda: dados, isLoaded: false }),
      
      setDiagnostico: (tipo, data) => 
        set((state) => ({ 
          diagnosticos: { ...state.diagnosticos, [tipo]: data } 
        })),
        
      setReferencias: (refs) => set({ referencias: refs }),
      
      setLoaded: (status) => set({ isLoaded: status }),
      
      reset: () => set({ 
        dadosFazenda: null, 
        diagnosticos: { trabalhador: null, hectare: null, produtividade: null, ccs: null },
        referencias: null,
        isLoaded: false 
      }),
    }),
    {
      name: 'educampo-app-storage', // Nome da chave no storage
      storage: createJSONStorage(() => sessionStorage), // Persistência em sessão
    }
  )
);