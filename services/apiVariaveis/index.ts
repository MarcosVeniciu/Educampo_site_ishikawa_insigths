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

/**
 * Função que simula a requisição à API para ir buscar as variáveis de referência.
 * Atualizada para receber o sistema de produção como parâmetro.
 */
export const fetchVariaveisReferencia = async (sistema_producao: string): Promise<VariaveisReferencia> => {
  // Simulando o tempo de resposta de uma API real (500ms)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        potencialTrabalhador: { min: 400, max: 600 },
        potencialArea: { min: 15, max: 30 },
        potencialVaca: { min: 15, max: 25 },
        limiteCcs: 400,
        precoLeiteReferencia: 2.50 // Adicionado apenas para evitar erros se a tela precisar
      });
    }, 500);
  });
};