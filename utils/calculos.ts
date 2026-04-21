import { Category } from '@/services/apiEducampo/types';

/**
 * Cálculos matemáticos e processamento de indicadores para o Site Educampo.
 * Centraliza toda a regra de negócio para facilitar a manutenção e testes.
 */

/**
 * Calcula a produção total diária de leite da fazenda.
 * @param vacasLactacao Quantidade de vacas em lactação.
 * @param producaoPorVaca Média de litros por vaca/dia.
 * @returns Produção total em Litros/Dia.
 */
export const calcularProducaoTotal = (vacasLactacao: number, producaoPorVaca: number): number => {
  return vacasLactacao * producaoPorVaca;
};

/**
 * Calcula a eficiência produtiva por hectare.
 * @param producaoTotal Produção total diária (L).
 * @param area Área total da atividade (ha).
 * @returns Litros/Hectare/Dia.
 */
export const calcularLitrosPorHectare = (producaoTotal: number, area: number): number => {
  if (area <= 0) return 0;
  return producaoTotal / area;
};

/**
 * Calcula a eficiência produtiva por trabalhador.
 * @param producaoTotal Produção total diária (L).
 * @param funcionarios Quantidade de funcionários.
 * @returns Litros/Trabalhador/Dia.
 */
export const calcularLitrosPorTrabalhador = (producaoTotal: number, funcionarios: number): number => {
  if (funcionarios <= 0) return 0;
  return producaoTotal / funcionarios;
};

/**
 * Calcula a taxa de vacas em lactação em relação ao rebanho total.
 * @param vacasLactacao Vacas em lactação.
 * @param vacasTotais Total de vacas (lactação + secas).
 * @returns Taxa em porcentagem (0-100).
 */
export const calcularTaxaLactacao = (vacasLactacao: number, vacasTotais: number): number => {
  if (vacasTotais <= 0) return 0;
  return (vacasLactacao / vacasTotais) * 100;
};

/**
 * Avalia o status de um indicador com base em limites (benchmarks).
 * @param valor Valor atual calculado.
 * @param min Limite inferior.
 * @param max Limite superior.
 * @param invert Se true, valores baixos são considerados 'alto' status (ex: CCS).
 * @returns 'baixo' | 'medio' | 'alto'
 */
export const avaliarStatus = (
  valor: number,
  min: number,
  max: number,
  invert: boolean = false
): 'baixo' | 'medio' | 'alto' => {
  if (invert) {
    if (valor <= min) return 'baixo';
    if (valor >= max) return 'alto';
    return 'medio';
  }

  if (valor < min) return 'baixo';
  if (valor > max) return 'alto';
  return 'medio';
};

/**
 * Varre as categorias do Ishikawa para encontrar o pilar com maior impacto percentual.
 * @param categorias Lista de categorias retornadas pela API Educampo.
 * @returns Objeto com o rótulo e o impacto do pilar principal.
 */
export const obterPilarMaiorImpacto = (categorias: Category[]): { label: string; impact: number } | null => {
  if (!categorias || categorias.length === 0) return null;
  
  return categorias.reduce((prev, current) => {
    return (prev.impact > current.impact) ? prev : current;
  });
};

/**
 * Conta o número total de causas raiz marcadas com severidade "alta" em todas as categorias.
 * @param categorias Lista de categorias retornadas pela API Educampo.
 * @returns Total de causas críticas.
 */
export const contarCausasAltaSeveridade = (categorias: Category[]): number => {
  if (!categorias) return 0;

  return categorias.reduce((total, cat) => {
    const causasAltas = cat.causes.filter(cause => cause.severity === 'alta').length;
    return total + causasAltas;
  }, 0);
};