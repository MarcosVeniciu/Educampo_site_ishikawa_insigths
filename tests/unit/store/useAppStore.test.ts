/**
 * @fileoverview Suíte de testes para o Estado Global da Aplicação (Zustand).
 * * ATENÇÃO - CONTRATO DE ARQUITETURA E SEGURANÇA:
 * Com a migração para HttpOnly Cookies, a Store NÃO deve mais se preocupar
 * em buscar ou gerenciar tokens no Web Storage (localStorage/sessionStorage).
 * A Store agora é estritamente voltada para "Dados de Negócio" (Business State).
 * * * Princípios testados:
 * 1. Isolamento de Responsabilidade: A store guarda apenas dados da fazenda e relatórios.
 * 2. Desacoplamento de Sessão: Nenhuma leitura de token ocorre no Storage.
 * 3. Persistência em Memória: Valida a gravação e limpeza do estado.
 */

import { useAppStore } from '../../../store/useAppStore';

describe('Store Global (useAppStore) - Contratos de Negócio e Segurança', () => {
  
  const mockFazenda = {
    nome_fazenda: "Fazenda Esperança",
    sistema_producao: "Compost Barn",
    vacas_em_lactacao_cabecas: 80,
    vacas_totais_cabecas: 100,
    animais_totais_cabecas: 150,
    funcionarios_qtd: 3,
    area_destinada_atividade_ha: 40,
    producao_leite_l_vaca_dia: 25
  };

  const mockDiagnostico = {
    categories: [
      {
        id: "mao-de-obra",
        label: "Mão de Obra",
        emoji: "👷",
        impact: 85,
        tag: "Principal fator limitante",
        causes: []
      }
    ]
  };

  beforeEach(() => {
    // Limpa a store e os mocks do storage antes de cada teste
    const { clearData } = useAppStore.getState();
    if (clearData) clearData(); // Garante que começamos com estado limpo
    
    jest.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  /**
   * Teste de Arquitetura (Segurança e Desacoplamento):
   * Garante que instanciar a store e manipular dados não aciona
   * a leitura do Storage em busca de tokens antigos.
   */
  it('NÃO deve acessar o localStorage ou sessionStorage para buscar tokens de autenticação', () => {
    const localGetSpy = jest.spyOn(window.localStorage, 'getItem');
    const sessionGetSpy = jest.spyOn(window.sessionStorage, 'getItem');

    // Executa operações normais da store
    const store = useAppStore.getState();
    store.setFazenda(mockFazenda);

    // Valida que o token NÃO foi procurado no client-side
    expect(localGetSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'));
    expect(sessionGetSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'));
  });

  /**
   * Teste de Gerenciamento de Estado de Negócio:
   * Valida se os dados inseridos no formulário (Simulação/Configuração) são salvos.
   */
  it('deve armazenar os dados da fazenda corretamente no estado global', () => {
    const store = useAppStore.getState();
    
    // Inicialmente deve estar vazio
    expect(store.fazenda).toBeNull();

    // Inserindo dados
    store.setFazenda(mockFazenda);

    // Validando a persistência em memória
    const storeAtualizada = useAppStore.getState();
    expect(storeAtualizada.fazenda).toEqual(mockFazenda);
    expect(storeAtualizada.fazenda?.nome_fazenda).toBe('Fazenda Esperança');
  });

  /**
   * Teste de Gerenciamento de Resultados de Diagnóstico:
   * Valida se as respostas da API são guardadas em cache na store (para não repetir requisições).
   */
  it('deve armazenar os resultados dos diagnósticos (cache em memória)', () => {
    const store = useAppStore.getState();

    // Inserindo resultado para a categoria 'trabalhador'
    store.setDiagnostico('trabalhador', mockDiagnostico);

    const storeAtualizada = useAppStore.getState();
    expect(storeAtualizada.diagnosticos['trabalhador']).toBeDefined();
    expect(storeAtualizada.diagnosticos['trabalhador']?.categories[0].id).toBe('mao-de-obra');
  });

  /**
   * Teste de Limpeza de Estado (Logout):
   * Garante que, ao sair do sistema, os dados sensíveis da fazenda sejam apagados da memória.
   */
  it('deve limpar todos os dados da memória (Fazenda e Diagnósticos) ao executar clearData', () => {
    const store = useAppStore.getState();
    
    // Poluindo o estado
    store.setFazenda(mockFazenda);
    store.setDiagnostico('trabalhador', mockDiagnostico);
    
    // Executando a limpeza
    store.clearData();

    // Verificando se tudo foi resetado
    const storeLimpa = useAppStore.getState();
    expect(storeLimpa.fazenda).toBeNull();
    expect(Object.keys(storeLimpa.diagnosticos).length).toBe(0);
  });
});