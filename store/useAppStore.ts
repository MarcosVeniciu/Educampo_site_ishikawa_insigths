/**
 * @fileoverview Gerenciamento de Estado Global utilizando Zustand.
 * Refatoração da Fase 4 (Finalização da Migração para HttpOnly Cookies).
 * * * Responsabilidades:
 * 1. Armazenar os dados técnicos da fazenda (ModelInput).
 * 2. Realizar o cache dos resultados de diagnósticos para evitar chamadas redundantes.
 * 3. Prover um método de limpeza total para o fluxo de logout.
 * * * Mudança Arquitetural:
 * - Removida toda a lógica de persistência ou leitura de tokens via Web Storage.
 * - A autenticação agora é transparente para a Store, sendo gerida via Cookies/BFF.
 */

import { create } from 'zustand';
import { ModelInput, DiagramaSaida } from '@/services/apiEducampo/types';

/**
 * Interface que define a estrutura do estado global.
 */
interface AppState {
  // Dados da fazenda preenchidos pelo usuário ou recuperados
  fazenda: ModelInput | null;
  
  // Cache de diagnósticos indexado pelo tipo (ex: 'ccs', 'hectare', 'trabalhador')
  diagnosticos: Record<string, DiagramaSaida>;
  
  /**
   * Atualiza os dados da fazenda no estado global.
   * @param dados Objeto contendo os índices técnicos da propriedade.
   */
  setFazenda: (dados: ModelInput) => void;
  
  /**
   * Armazena o resultado de um diagnóstico específico.
   * @param tipo Identificador do diagnóstico (ex: 'trabalhador').
   * @param resultado Objeto DiagramaSaida retornado pela LLM.
   */
  setDiagnostico: (tipo: string, resultado: DiagramaSaida) => void;
  
  /**
   * Limpa todos os dados sensíveis da memória.
   * Deve ser chamado durante o processo de encerramento de sessão (Logout).
   */
  clearData: () => void;
}

/**
 * Hook customizado useAppStore para acesso ao estado global.
 * Utiliza o padrão de "Selective State" do Zustand para performance.
 */
export const useAppStore = create<AppState>((set) => ({
  // Estado Inicial
  fazenda: null,
  diagnosticos: {},

  // Ações (Actions)
  setFazenda: (dados) => 
    set({ fazenda: dados }),

  setDiagnostico: (tipo, resultado) => 
    set((state) => ({ 
      diagnosticos: { 
        ...state.diagnosticos, 
        [tipo]: resultado 
      } 
    })),

  clearData: () => 
    set({ 
      fazenda: null, 
      diagnosticos: {} 
    }),
}));