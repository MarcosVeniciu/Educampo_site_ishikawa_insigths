# 🧮 Utils (Cálculos e Processamento)

Este diretório contém as funções matemáticas e lógicas de negócios isoladas do sistema Educampo. 

Abaixo está a documentação completa, incluindo o **código-fonte integral** contido nesta pasta, o que facilita a consulta rápida da equipe de desenvolvimento sem precisar navegar entre os arquivos.

---

## 📄 Código-Fonte: `calculos.ts`

Este é o motor central de cálculos zootécnicos e de processamento das respostas da IA (Diagrama de Ishikawa 6M). As funções foram construídas de forma pura para facilitar testes unitários e importação nos Dashboards e Diagnósticos.

```typescript
import { Category } from '@/services/apiEducampo/types';

// ============================================================================
// 📊 INDICADORES ZOOTÉCNICOS E FINANCEIROS
// ============================================================================

/**
 * Calcula a produção de leite total por dia.
 */
export const calcularProducaoTotal = (vacas: number, media: number): number => {
  if (!vacas || !media) return 0;
  return vacas * media;
};

/**
 * Calcula a eficiência do uso da terra (Litros por Hectare).
 */
export const calcularLitrosPorHectare = (producaoTotal: number, area: number): number => {
  if (!area || area === 0) return 0; // Proteção contra divisão por zero
  return producaoTotal / area;
};

/**
 * Calcula a eficiência da mão de obra (Litros por Trabalhador).
 */
export const calcularLitrosPorTrabalhador = (producaoTotal: number, funcionarios: number): number => {
  if (!funcionarios || funcionarios === 0) return 0; // Proteção contra divisão por zero
  return producaoTotal / funcionarios;
};

/**
 * Calcula o percentual de vacas que estão ativamente em fase de lactação.
 */
export const calcularTaxaLactacao = (vacasLactacao: number, vacasTotais: number): number => {
  if (!vacasTotais || vacasTotais === 0) return 0; // Proteção contra divisão por zero
  return (vacasLactacao / vacasTotais) * 100;
};

// ============================================================================
// 🚦 MOTORES DE AVALIAÇÃO (REGRAS DE NEGÓCIO)
// ============================================================================

/**
 * Avalia o status de uma métrica em relação aos limites ideais.
 * @param isInverso Quando `true`, indica que o valor é melhor quando está BAIXO (Ex: Células Somáticas / CCS).
 */
export const avaliarStatus = (
  valorAtual: number, 
  min: number, 
  max: number, 
  isInverso: boolean = false
): 'baixo' | 'medio' | 'alto' => {
  if (valorAtual < min) return 'baixo';
  if (valorAtual > max) return 'alto';
  return 'medio';
};

// ============================================================================
// 🧠 PROCESSAMENTO DE ISHIKAWA (IA)
// ============================================================================

/**
 * Varre a resposta da IA e identifica a categoria (Ex: Mão de obra, Método) que 
 * tem o maior impacto na perda de produtividade.
 */
export const obterPilarMaiorImpacto = (categorias: Category[]): Category | null => {
  if (!categorias || categorias.length === 0) return null;
  return categorias.reduce((prev, current) => 
    (prev.impact > current.impact) ? prev : current
  );
};

/**
 * Percorre o modelo da IA para contabilizar quantas causas raízes foram classificadas
 * com severidade ALTA (Alerta vermelho).
 */
export const contarCausasAltaSeveridade = (categorias: Category[]): number => {
  if (!categorias || categorias.length === 0) return 0;
  return categorias.reduce((total, cat) => {
    const causasAltas = cat.causes.filter(c => c.severity === 'alta').length;
    return total + causasAltas;
  }, 0);
};
```