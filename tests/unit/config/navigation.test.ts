/**
 * @fileoverview Suíte de testes unitários para a configuração de navegação.
 * Valida a integridade do menu lateral e o comportamento da função de detecção
 * de rota ativa.
 * * * Framework presumido: Jest ou Vitest
 */

import { navigationConfig, getActiveNavInfo } from '../../../config/navigation';

describe('Configuração de Navegação (config/navigation.ts)', () => {
  
  describe('navigationConfig', () => {
    /**
     * Teste de sanidade: Verifica se a configuração existe e não está vazia.
     * Se esse teste falhar, significa que o menu sumiu do sistema.
     */
    it('deve exportar um array de configurações não vazio', () => {
      expect(Array.isArray(navigationConfig)).toBe(true);
      expect(navigationConfig.length).toBeGreaterThan(0);
    });

    /**
     * Teste de contrato: Garante que todos os objetos dentro do array
     * respeitem a interface NavItem, possuindo os campos obrigatórios.
     */
    it('todos os itens de navegação devem conter label, href e icon', () => {
      navigationConfig.forEach(item => {
        expect(item).toHaveProperty('label');
        expect(item.label.length).toBeGreaterThan(0);
        
        expect(item).toHaveProperty('href');
        expect(item.href.startsWith('/')).toBe(true); // Todas rotas devem ser absolutas a partir da raiz
        
        expect(item).toHaveProperty('icon');
        expect(item.icon).toBeDefined();
      });
    });

    /**
     * Teste de negócio: Garante que as rotas vitais do sistema nunca sejam 
     * removidas acidentalmente por outro desenvolvedor.
     */
    it('deve conter as rotas principais do sistema (Dashboard, Diagnóstico, Simulação, Configurações)', () => {
      const rotas = navigationConfig.map(item => item.href);
      expect(rotas).toContain('/dashboard');
      expect(rotas).toContain('/diagnostico/geral');
      expect(rotas).toContain('/simulacao');
      expect(rotas).toContain('/configuracoes');
    });
  });

  describe('getActiveNavInfo()', () => {
    /**
     * Verifica o funcionamento básico da função de busca de rota.
     */
    it('deve retornar o item correto quando a URL bater exatamente com o href', () => {
      const activeInfo = getActiveNavInfo('/dashboard');
      expect(activeInfo).toBeDefined();
      expect(activeInfo?.label).toBe('Dashboard');
    });

    /**
     * Verifica se a função lida corretamente com sub-rotas usando startsWith.
     * Importante para o Next.js onde `/diagnostico/geral` pode ter páginas filhas.
     */
    it('deve retornar o item correto para sub-rotas (nested routes)', () => {
      // Simulando o usuário entrando em um diagnóstico específico, ex: /diagnostico/geral/clima
      const activeInfo = getActiveNavInfo('/diagnostico/geral/clima');
      expect(activeInfo).toBeDefined();
      expect(activeInfo?.label).toBe('Diagnóstico');
    });

    /**
     * Garante que páginas não mapeadas no menu não quebrem a função,
     * retornando undefined graciosamente.
     */
    it('deve retornar undefined para rotas não mapeadas no menu', () => {
      const activeInfo = getActiveNavInfo('/rota-secreta-inexistente');
      expect(activeInfo).toBeUndefined();
    });
    
    /**
     * Teste de borda: Verifica o comportamento em uma página raiz ou vazia.
     */
    it('deve retornar undefined se passado um caminho vazio ou apenas a raiz que não está no config', () => {
      const activeInfo = getActiveNavInfo('/');
      // Como não mapeamos a raiz '/' no navigationConfig, deve ser undefined
      expect(activeInfo).toBeUndefined();
    });
  });

});