/**
 * @fileoverview Gerenciamento de Estado Global utilizando Zustand.
 * Refatoração da Fase 4 (Finalização da Migração para HttpOnly Cookies).
 */

import { create } from 'zustand';
import { ModelInput, DiagramaSaida } from '@/services/apiEducampo/types';

/**
 * Interface que define a estrutura do estado global.
 */
interface AppState {
  // Dados da fazenda preenchidos pelo usuário ou recuperados
  dadosFazenda: ModelInput | null;
  
  // Cache de diagnósticos indexado pelo tipo (ex: 'ccs', 'hectare', 'trabalhador')
  diagnosticos: Record<string, DiagramaSaida>;

  // Variáveis de referência (metas) da API
  referencias: any | null;

  // Flag que indica se o carregamento inicial (diagnósticos) foi concluído
  isLoaded: boolean;
  
  /**
   * Atualiza os dados da fazenda no estado global.
   */
  setFazenda: (dados: ModelInput) => void;
  
  /**
   * Armazena o resultado de um diagnóstico específico.
   */
  setDiagnostico: (tipo: string, resultado: DiagramaSaida) => void;

  /**
   * Armazena as variáveis de referência buscadas na API.
   */
  setReferencias: (refs: any) => void;

  /**
   * Define se o carregamento global foi concluído.
   */
  setLoaded: (loaded: boolean) => void;
  
  /**
   * Limpa todos os dados sensíveis da memória (Logout).
   */
  clearData: () => void;
}

/**
 * Hook customizado useAppStore para acesso ao estado global.
 */
export const useAppStore = create<AppState>((set) => ({
  // Estado Inicial
  dadosFazenda: null,
  diagnosticos: {},
  referencias: null,
  isLoaded: false,

  // Ações (Actions)
  setFazenda: (dados) => 
    set({ dadosFazenda: dados }),

  setDiagnostico: (tipo, resultado) => 
    set((state) => ({ 
      diagnosticos: { 
        ...state.diagnosticos, 
        [tipo]: resultado 
      } 
    })),

  setReferencias: (refs) => 
    set({ referencias: refs }),

  setLoaded: (loaded) => 
    set({ isLoaded: loaded }),

  clearData: () => 
    set({ 
      dadosFazenda: null, 
      diagnosticos: {},
      referencias: null,
      isLoaded: false
    }),
}));