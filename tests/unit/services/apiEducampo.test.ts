import { fetchDiagnostico } from '@/services/apiEducampo';
import { ModelInput } from '@/services/apiEducampo/types';

/**
 * Suíte de testes para a Fachada (Facade) da API Educampo.
 * Valida se a integração entre o serviço e os mocks está entregando os dados
 * conforme o contrato de interface esperado pelo front-end.
 */
describe('Service: apiEducampo', () => {
  
  /**
   * Objeto de entrada padrão simulando os dados de uma fazenda.
   */
  const mockInput: ModelInput = {
    nome_fazenda: "Fazenda Experimental",
    sistema_producao: "Pasto",
    vacas_em_lactacao_cabecas: 80,
    vacas_totais_cabecas: 100,
    animais_totais_cabecas: 150,
    funcionarios_qtd: 3,
    area_destinada_atividade_ha: 40,
    producao_leite_l_vaca_dia: 22,
    ccs_celulas_ml: 250
  };

  // Ajusta o timeout para acomodar o delay proposital de 2s dos mocks
  jest.setTimeout(5000);

  it('deve retornar o diagnóstico de "trabalhador" com pilares técnicos válidos', async () => {
    const data = await fetchDiagnostico('trabalhador', mockInput);

    expect(data).toBeDefined();
    expect(data.categories).toBeInstanceOf(Array);
    
    // Valida se o pilar Mão de Obra (presente no mock) foi retornado
    const maoDeObra = data.categories.find(c => c.id === 'mao-de-obra');
    expect(maoDeObra).toBeDefined();
    expect(maoDeObra?.impact).toBeGreaterThan(0);
    expect(maoDeObra?.causes.length).toBeGreaterThan(0);
  });

  it('deve garantir que o diagnóstico de "hectare" possui os campos de severidade', async () => {
    const data = await fetchDiagnostico('hectare', mockInput);
    
    // Verifica se a primeira causa encontrada possui um nível de severidade válido
    const primeiraCausa = data.categories[0].causes[0];
    expect(['alta', 'media', 'baixa']).toContain(primeiraCausa.severity);
    expect(primeiraCausa.detail).toBeTruthy();
  });

  it('deve validar se a resposta é assíncrona (retorna uma Promise)', async () => {
    const promise = fetchDiagnostico('produtividade', mockInput);
    expect(promise).toBeInstanceOf(Promise);
    
    const result = await promise;
    expect(result).toHaveProperty('categories');
  });

  it('deve retornar o diagnóstico de "ccs" contendo termos técnicos de ordenha', async () => {
    const data = await fetchDiagnostico('ccs', mockInput);
    const jsonString = JSON.stringify(data);
    
    // Verifica se termos essenciais do PDF estão presentes no mock
    expect(jsonString.toLowerCase()).toContain('dipping');
    expect(jsonString.toLowerCase()).toContain('higiene');
  });
});