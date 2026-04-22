/**
 * Níveis de severidade permitidos para as causas raiz no diagrama de Ishikawa.
 */
export type SeverityLevel = 'alta' | 'media' | 'baixa';

/**
 * Representa uma causa raiz identificada dentro de um pilar do Ishikawa.
 */
export interface Cause {
  /** Título curto e direto da causa (ex: "Trabalhador sem qualificação") */
  text: string;
  /** Nível de gravidade que define a urgência da ação */
  severity: SeverityLevel;
  /** Explicação técnica detalhada e sugestão de ação prática */
  detail: string;
}

/**
 * Representa um dos "Ms" (categorias) do Diagrama de Ishikawa.
 */
export interface Category {
  /** Identificador único do pilar (ex: "mao-de-obra", "metodo") */
  id: string;
  /** Nome legível para exibição na interface */
  label: string;
  /** Emoji ou ícone representativo da categoria */
  emoji: string;
  /** Impacto percentual estimado desta categoria no problema principal (0-100) */
  impact: number;
  /** Texto de destaque ou status da categoria (ex: "Principal fator limitante") */
  tag: string;
  /** Lista de causas específicas encontradas nesta categoria */
  causes: Cause[];
}

/**
 * Estrutura de saída consolidada retornada pela LLM (API Educampo).
 */
export interface DiagramaSaida {
  /** Lista de pilares que compõem o diagnóstico completo */
  categories: Category[];
}

/**
 * Dados obrigatórios e opcionais enviados para a API realizar o diagnóstico.
 */
export interface ModelInput {
  /** Nome da propriedade rural */
  nome_fazenda: string;
  /** Tipo de sistema (ex: "Pasto", "Compost Barn", "Free Stall") */
  sistema_producao: string;
  /** Quantidade de vacas produzindo leite atualmente */
  vacas_em_lactacao_cabecas: number;
  /** Quantidade total de vacas no rebanho (incluindo secas) */
  vacas_totais_cabecas: number;
  /** Total de animais na fazenda (bezerros, novilhas, touros) */
  animais_totais_cabecas: number;
  /** Número total de colaboradores envolvidos na atividade */
  funcionarios_qtd: number;
  /** Área total da propriedade destinada à atividade leiteira em hectares */
  area_destinada_atividade_ha: number;
  /** Opcional: Produção média atual por vaca (Litros/Vaca/Dia) */
  producao_leite_l_vaca_dia?: number;
  /** Opcional: Contagem de Células Somáticas atual (Células/mL) */
  ccs_celulas_ml?: number;
}