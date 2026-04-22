/**
 * @fileoverview Suíte de testes para os serviços da API Educampo.
 * * ATENÇÃO - CONTRATO DE SEGURANÇA (HttpOnly Cookies):
 * Esta suíte garante que as requisições HTTP feitas pelo frontend
 * estão devidamente configuradas para trafegar cookies seguros de forma automática.
 * * * Princípios testados:
 * 1. Envio de Credenciais (credentials: 'include') - Essencial para que
 * o navegador anexe o cookie HttpOnly no cabeçalho das requisições.
 * 2. Estrutura de Payload (ModelInput) - Garante que os dados da fazenda
 * estão sendo enviados no formato exigido pela LLM.
 */

import { apiEducampo } from '../../../services/apiEducampo';

describe('Serviços da API Educampo (Contrato de Integração HTTP)', () => {
  
  // Dados de entrada genéricos simulando a Store (ModelInput)
  const mockInputFazenda = {
    nome_fazenda: "Fazenda Esperança",
    sistema_producao: "Compost Barn",
    vacas_em_lactacao_cabecas: 80,
    vacas_totais_cabecas: 100,
    animais_totais_cabecas: 150,
    funcionarios_qtd: 3,
    area_destinada_atividade_ha: 40,
    producao_leite_l_vaca_dia: 25
  };

  beforeEach(() => {
    // Limpamos todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Substituímos o fetch global por um espião (Mock)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        categories: [] // Mock simples de um DiagramaSaida vazio
      })
    });
  });

  afterAll(() => {
    // Restaura o fetch original ao final dos testes
    jest.restoreAllMocks();
  });

  /**
   * Teste do Contrato de Cookies (Obrigatório para HttpOnly)
   * Garante que a requisição instrui o navegador a enviar os cookies armazenados.
   */
  it('DEVE configurar "credentials: include" nas requisições para enviar o Cookie HttpOnly', async () => {
    // Para este teste genérico, assumimos que existe um método base de diagnóstico,
    // ou usamos um dos específicos (como diagnosticarTrabalhador se estiver exportado diretamente).
    // Adapte o nome do método caso a sua facade exponha nomes diferentes (ex: obterDiagnostico).
    
    // Executamos a chamada ao serviço
    if (typeof apiEducampo.diagnosticarTrabalhador === 'function') {
      await apiEducampo.diagnosticarTrabalhador(mockInputFazenda);
    } else {
      // Fallback genérico caso a facade tenha um método centralizado
      // @ts-ignore
      await apiEducampo.post('/api/diagnostico/trabalhador', mockInputFazenda);
    }

    // Validação principal: O fetch FOI chamado?
    expect(global.fetch).toHaveBeenCalled();

    // Captura os argumentos que foram passados para o fetch na primeira chamada
    const [urlCall, optionsCall] = (global.fetch as jest.Mock).mock.calls[0];

    // Verifica se a URL alvo está correta
    expect(urlCall).toContain('/api/diagnostico');

    // Validação CRÍTICA de segurança: A opção de incluir credenciais está presente?
    expect(optionsCall).toBeDefined();
    expect(optionsCall.credentials).toBe('include');
  });

  /**
   * Teste do Contrato de Payload (ModelInput)
   * Garante que os dados enviados no corpo da requisição seguem a interface exigida.
   */
  it('DEVE enviar o Payload (ModelInput) corretamente no corpo da requisição POST', async () => {
    if (typeof apiEducampo.diagnosticarCcs === 'function') {
      await apiEducampo.diagnosticarCcs(mockInputFazenda);
    }

    const [, optionsCall] = (global.fetch as jest.Mock).mock.calls[0];

    // Valida que o método HTTP é POST
    expect(optionsCall.method).toBe('POST');
    
    // Valida que o corpo da requisição contém os dados serializados da fazenda
    const bodyEnviado = JSON.parse(optionsCall.body);
    expect(bodyEnviado.nome_fazenda).toBe("Fazenda Esperança");
    expect(bodyEnviado.vacas_em_lactacao_cabecas).toBe(80);
    expect(bodyEnviado.funcionarios_qtd).toBe(3);
  });
});