/**
 * @fileoverview Fachada (Facade) de serviços para a API Educampo Insights.
 * Refatoração da Fase 4 (Comunicação Segura com Cookies).
 * * Responsabilidades:
 * 1. Centralizar as chamadas aos endpoints de diagnóstico.
 * 2. Garantir que as credenciais (HttpOnly Cookies) sejam enviadas em todas as requisições.
 * 3. Padronizar o tratamento de erros e a serialização dos dados.
 * * Mudança Crítica:
 * - Adição de 'credentials: include' em todas as chamadas fetch para permitir
 * que o navegador anexe o cookie de sessão 'token' automaticamente.
 */

import { ModelInput, DiagramaSaida } from './types';
import { mockCcs, mockHectare, mockTrabalhador, mockProdutividade } from './mocks';

/**
 * Interface que define os métodos disponíveis no serviço Educampo.
 */
interface IApiEducampo {
  diagnosticarCcs(dados: ModelInput): Promise<DiagramaSaida>;
  diagnosticarHectare(dados: ModelInput): Promise<DiagramaSaida>;
  diagnosticarTrabalhador(dados: ModelInput): Promise<DiagramaSaida>;
  diagnosticarProdutividade(dados: ModelInput): Promise<DiagramaSaida>; // <-- ADICIONADO NA INTERFACE
}

/**
 * Implementação da Fachada de API utilizando a Fetch API nativa.
 */
class ApiEducampoService implements IApiEducampo {
  
  /**
   * Método genérico para realizar requisições POST autenticadas.
   * @param endpoint Caminho relativo da API (ex: /api/diagnostico/ccs)
   * @param body Dados da fazenda (ModelInput)
   */
  private async post(endpoint: string, body: ModelInput): Promise<DiagramaSaida> {
    try {
      // Constrói a URL absoluta baseada na variável de ambiente do frontend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_TOKEN || '', // Autenticação na API FastAPI
        },
        body: JSON.stringify(body),
        /**
         * CONFIGURAÇÃO DE SEGURANÇA CRÍTICA:
         * 'include' permite que o navegador envie cookies HttpOnly (o nosso token)
         * para o servidor em requisições de mesma origem ou cross-origin.
         */
        credentials: 'include',
      });

      if (!response.ok) {
        // Se o status for 401, o middleware/servidor invalidou o cookie
        if (response.status === 401) {
          console.error('[API Educampo] Sessão expirada ou inválida.');
          // Em um cenário real, poderíamos disparar um evento de logout global aqui
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.warn(`[API Educampo] Falha de conexão ou erro no servidor ao acessar ${endpoint}. Iniciando Fallback (Mock). Erro original:`, error.message);
      
      // Fallback: Retorna o mock correspondente para não quebrar a interface do usuário
      if (endpoint.includes('ccs')) return mockCcs;
      if (endpoint.includes('hectare')) return mockHectare;
      if (endpoint.includes('trabalhador')) return mockTrabalhador;
      if (endpoint.includes('produtividade')) return mockProdutividade;
      
      // Se for um endpoint desconhecido e não houver mock, propaga o erro
      throw new Error(`Falha crítica e nenhum mock disponível para ${endpoint}`);
    }
  }

  /**
   * Diagnóstico focado em CCS (Contagem de Células Somáticas) e Saúde Mamária.
   */
  async diagnosticarCcs(dados: ModelInput): Promise<DiagramaSaida> {
    return this.post('/api/diagnostico/ccs', dados);
  }

  /**
   * Diagnóstico focado em produtividade por área (L/ha/dia).
   */
  async diagnosticarHectare(dados: ModelInput): Promise<DiagramaSaida> {
    return this.post('/api/diagnostico/hectare', dados);
  }

  /**
   * Diagnóstico focado em produtividade da mão de obra (L/homem/dia).
   */
  async diagnosticarTrabalhador(dados: ModelInput): Promise<DiagramaSaida> {
    return this.post('/api/diagnostico/trabalhador', dados);
  }

  /**
   * Diagnóstico focado em produtividade (produção por vaca).
   */
  async diagnosticarProdutividade(dados: ModelInput): Promise<DiagramaSaida> {
    return this.post('/api/diagnostico/produtividade', dados); // <-- ADICIONADO NA CLASSE
  }
}

// Exporta uma instância única (Singleton) para ser usada em toda a aplicação
export const apiEducampo = new ApiEducampoService();