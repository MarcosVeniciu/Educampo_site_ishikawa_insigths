import { ReferenciasGlobais } from './index';

/**
 * Mock de variáveis de referência e potenciais de mercado.
 * Os valores foram extraídos dos documentos de referência (Ishikawa) 
 * e segmentados por sistema de produção para permitir cálculos dinâmicos.
 */
export const mockReferencias: ReferenciasGlobais = {
  /**
   * Parâmetros para sistemas baseados em Pastagem.
   * Referência: ishikawa-hectare-6m.pdf e ishikawa-trabalhador-6m.pdf
   */
  "Pasto": {
    potencialVaca: { min: 18, max: 22 },
    potencialArea: { min: 30, max: 40 },
    potencialTrabalhador: { min: 400, max: 500 },
    limiteCcs: 200000,
    precoLeiteReferencia: 2.35
  },
  
  /**
   * Parâmetros para sistemas intensivos (Compost Barn / Free Stall).
   * Valores ajustados para a realidade de alta tecnologia e maior escala.
   */
  "Confinamento": {
    potencialVaca: { min: 28, max: 35 },
    potencialArea: { min: 60, max: 100 },
    potencialTrabalhador: { min: 600, max: 800 },
    limiteCcs: 200000,
    precoLeiteReferencia: 2.45
  },

  /**
   * Fallback genérico para sistemas não especificados.
   */
  "Padrao": {
    potencialVaca: { min: 20, max: 25 },
    potencialArea: { min: 30, max: 45 },
    potencialTrabalhador: { min: 400, max: 600 },
    limiteCcs: 400000,
    precoLeiteReferencia: 2.30
  }
};