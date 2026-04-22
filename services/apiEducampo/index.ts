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

/**
 * Interface que define os métodos disponíveis no serviço Educampo.
 */
interface IApiEducampo {
  diagnosticarCcs(dados: ModelInput): Promise<DiagramaSaida>;
  diagnosticarHectare(dados: ModelInput): Promise<DiagramaSaida>;
  diagnosticarTrabalhador(dados: ModelInput): Promise<DiagramaSaida>;
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      console.error(`[API Educampo Error] Falha ao acessar ${endpoint}:`, error.message);
      throw error;
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
}

// Exporta uma instância única (Singleton) para ser usada em toda a aplicação
export const apiEducampo = new ApiEducampoService();