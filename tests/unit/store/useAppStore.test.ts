import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '@/store/useAppStore';
import { ModelInput, DiagramaSaida } from '@/services/apiEducampo/types';
import { VariaveisReferencia } from '@/services/apiVariaveis/types';

/**
 * Suíte de testes para o Gerenciamento de Estado Global (Zustand).
 * Valida a integridade dos dados durante transições de estado, o sucesso
 * das ações (actions) e a eficácia da limpeza de dados (logout/reset).
 */
describe('Store: useAppStore', () => {
  
  /**
   * Limpa a store antes de cada teste para garantir que o estado de um teste
   * não interfira no próximo (isolamento).
   */
  beforeEach(() => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.reset();
    });
  });

  const mockFazenda: ModelInput = {
    nome_fazenda: "Fazenda Teste",
    sistema_producao: "Pasto",
    vacas_em_lactacao_cabecas: 50,
    vacas_totais_cabecas: 60,
    animais_totais_cabecas: 100,
    funcionarios_qtd: 2,
    area_destinada_atividade_ha: 30,
  };

  const mockDiagnostico: DiagramaSaida = {
    categories: []
  };

  const mockRefs: VariaveisReferencia = {
    potencialVaca: { min: 20, max: 30 },
    potencialArea: { min: 30, max: 40 },
    potencialTrabalhador: { min: 400, max: 600 },
    limiteCcs: 200,
    precoLeiteReferencia: 2.5
  };

  it('deve iniciar com estado limpo e flag de carregamento falsa', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.dadosFazenda).toBeNull();
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.diagnosticos.trabalhador).toBeNull();
  });

  it('setDadosFazenda: deve atualizar os dados cadastrais e forçar isLoaded como false', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setDadosFazenda(mockFazenda);
    });

    expect(result.current.dadosFazenda).toEqual(mockFazenda);
    expect(result.current.isLoaded).toBe(false);
  });

  it('setDiagnostico: deve atualizar atomicamente apenas o diagnóstico solicitado', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setDiagnostico('trabalhador', mockDiagnostico);
    });

    expect(result.current.diagnosticos.trabalhador).toEqual(mockDiagnostico);
    expect(result.current.diagnosticos.ccs).toBeNull();
  });

  it('setReferencias: deve salvar os benchmarks de mercado corretamente', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setReferencias(mockRefs);
    });

    expect(result.current.referencias).toEqual(mockRefs);
  });

  it('setLoaded: deve sinalizar que a Dashboard está pronta para renderização', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setLoaded(true);
    });

    expect(result.current.isLoaded).toBe(true);
  });

  it('reset: deve limpar todos os dados da sessão e retornar ao estado original', () => {
    const { result } = renderHook(() => useAppStore());

    // Preenche para testar a limpeza
    act(() => {
      result.current.setDadosFazenda(mockFazenda);
      result.current.setLoaded(true);
    });

    expect(result.current.dadosFazenda).not.toBeNull();

    // Executa o reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.dadosFazenda).toBeNull();
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.diagnosticos.trabalhador).toBeNull();
  });
});