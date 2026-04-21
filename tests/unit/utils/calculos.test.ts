import * as calc from '@/utils/calculos';
import { Category } from '@/services/apiEducampo/types';

/**
 * Suíte de testes unitários para o módulo de cálculos e processamento.
 * Valida a precisão matemática das fórmulas de desempenho leiteiro e a 
 * lógica de extração de insights dos diagnósticos de Ishikawa.
 */
describe('Utils: calculos.ts', () => {
  
  /**
   * Testes para o cálculo de volume total diário.
   */
  describe('calcularProducaoTotal', () => {
    it('deve calcular corretamente a produção total multiplicando vacas por média', () => {
      expect(calc.calcularProducaoTotal(10, 25)).toBe(250);
      expect(calc.calcularProducaoTotal(100, 15.5)).toBe(1550);
    });

    it('deve retornar zero se algum parâmetro for zero', () => {
      expect(calc.calcularProducaoTotal(0, 25)).toBe(0);
      expect(calc.calcularProducaoTotal(10, 0)).toBe(0);
    });
  });

  /**
   * Testes para eficiência territorial (Litros/Hectare).
   */
  describe('calcularLitrosPorHectare', () => {
    it('deve calcular a eficiência por área corretamente', () => {
      expect(calc.calcularLitrosPorHectare(1000, 10)).toBe(100);
      expect(calc.calcularLitrosPorHectare(500, 20)).toBe(25);
    });

    it('deve retornar zero se a área for zero para evitar erro de divisão', () => {
      expect(calc.calcularLitrosPorHectare(1000, 0)).toBe(0);
    });
  });

  /**
   * Testes para produtividade da mão de obra (Litros/Trabalhador).
   */
  describe('calcularLitrosPorTrabalhador', () => {
    it('deve calcular a eficiência por funcionário corretamente', () => {
      expect(calc.calcularLitrosPorTrabalhador(1200, 3)).toBe(400);
    });

    it('deve retornar zero se a quantidade de funcionários for zero', () => {
      expect(calc.calcularLitrosPorTrabalhador(1200, 0)).toBe(0);
    });
  });

  /**
   * Testes para taxa de ocupação do rebanho em lactação.
   */
  describe('calcularTaxaLactacao', () => {
    it('deve calcular a porcentagem de vacas em lactação', () => {
      expect(calc.calcularTaxaLactacao(80, 100)).toBe(80);
      expect(calc.calcularTaxaLactacao(50, 200)).toBe(25);
    });

    it('deve retornar zero se o total de vacas for zero', () => {
      expect(calc.calcularTaxaLactacao(50, 0)).toBe(0);
    });
  });

  /**
   * Testes para o motor de avaliação de status (Semáforo visual).
   */
  describe('avaliarStatus', () => {
    const min = 400;
    const max = 600;

    it('deve retornar "baixo" quando o valor estiver abaixo do mínimo', () => {
      expect(calc.avaliarStatus(350, min, max)).toBe('baixo');
    });

    it('deve retornar "medio" quando o valor estiver entre o intervalo', () => {
      expect(calc.avaliarStatus(500, min, max)).toBe('medio');
    });

    it('deve retornar "alto" quando o valor for superior ao máximo', () => {
      expect(calc.avaliarStatus(700, min, max)).toBe('alto');
    });

    it('deve inverter a lógica para indicadores como CCS (onde menos é melhor)', () => {
      // Para CCS: valores baixos são desejáveis (Verde), altos são críticos (Vermelho)
      const ccsMin = 200;
      const ccsMax = 400;
      expect(calc.avaliarStatus(150, ccsMin, ccsMax, true)).toBe('baixo');
      expect(calc.avaliarStatus(500, ccsMin, ccsMax, true)).toBe('alto');
      expect(calc.avaliarStatus(300, ccsMin, ccsMax, true)).toBe('medio');
    });
  });

  /**
   * Testes para processamento de dados vindos da LLM/API Educampo.
   */
  describe('Processamento de Ishikawa', () => {
    const mockCategorias: Category[] = [
      {
        id: 'mao-de-obra',
        label: 'Mão de Obra',
        emoji: '👥',
        impact: 80,
        tag: 'Principal',
        causes: [
          { text: 'Causa 1', severity: 'alta', detail: '' },
          { text: 'Causa 2', severity: 'media', detail: '' }
        ]
      },
      {
        id: 'metodo',
        label: 'Método',
        emoji: '📋',
        impact: 40,
        tag: 'Secundário',
        causes: [
          { text: 'Causa 3', severity: 'alta', detail: '' },
          { text: 'Causa 4', severity: 'baixa', detail: '' }
        ]
      }
    ];

    it('obterPilarMaiorImpacto: deve identificar a categoria com maior impacto percentual', () => {
      const pilar = calc.obterPilarMaiorImpacto(mockCategorias);
      expect(pilar?.id).toBe('mao-de-obra');
      expect(pilar?.impact).toBe(80);
    });

    it('contarCausasAltaSeveridade: deve somar corretamente causas com severidade "alta"', () => {
      const total = calc.contarCausasAltaSeveridade(mockCategorias);
      expect(total).toBe(2);
    });

    it('deve retornar valores nulos ou zero para listas vazias', () => {
      expect(calc.obterPilarMaiorImpacto([])).toBeNull();
      expect(calc.contarCausasAltaSeveridade([])).toBe(0);
    });
  });
});