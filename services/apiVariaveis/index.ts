/**
 * Define um intervalo numérico de referência (benchmark).
 */
export interface Range {
  /** Valor mínimo esperado para uma boa performance */
  min: number;
  /** Valor máximo esperado ou meta ideal */
  max: number;
}

/**
 * Estrutura das variáveis de mercado e metas (Potenciais).
 * Estes valores são usados na Dashboard para calcular o "Gap" do produtor.
 */
export interface VariaveisReferencia {
  /** Metas de produtividade por animal (Litros/Vaca/Dia) */
  potencialVaca: Range;
  /** Metas de eficiência territorial (Litros/Hectare/Dia) */
  potencialArea: Range;
  /** Metas de produtividade da mão de obra (Litros/Trabalhador/Dia) */
  potencialTrabalhador: Range;
  /** Limite máximo tolerado para CCS antes de penalidades ou mastite clínica */
  limiteCcs: number;
  /** Valor de mercado do leite usado para cálculos de impacto financeiro (R$/Litro) */
  precoLeiteReferencia: number;
}

/**
 * Mapeamento de variáveis por sistema de produção.
 */
export interface ReferenciasGlobais {
  /** Chave: Nome do sistema de produção (ex: "Pasto", "Confinamento") */
  [sistema: string]: VariaveisReferencia;
}