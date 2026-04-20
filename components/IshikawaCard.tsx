/**
 * @fileoverview Componente visual para exibição das causas no formato Ishikawa.
 * Apresenta uma categoria (ex: Máquinas), a causa principal e subcausas,
 * com feedback visual de cores baseado no nível de criticidade do problema.
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info, LucideIcon } from 'lucide-react';

/**
 * Níveis de criticidade aceitos pelo componente.
 * @typedef {'baixa' | 'media' | 'alta'} Criticidade
 */
export type Criticidade = 'baixa' | 'media' | 'alta';

/**
 * Propriedades (Props) esperadas pelo componente IshikawaCard.
 * @interface IshikawaCardProps
 * @property {string} titulo - A categoria da espinha de peixe (ex: "Mão de Obra", "Meio Ambiente").
 * @property {string} causaPrincipal - A descrição resumida do problema principal encontrado.
 * @property {Criticidade} criticidade - Define a cor da borda e o ícone de alerta.
 * @property {string[]} [subCausas] - Lista opcional de desdobramentos ou detalhes da causa.
 * @property {() => void} [onClick] - Função opcional acionada ao clicar no card (útil para abrir modais de edição).
 */
export interface IshikawaCardProps {
  titulo: string;
  causaPrincipal: string;
  criticidade: Criticidade;
  subCausas?: string[];
  onClick?: () => void;
}

/**
 * Mapeamento de estilos do Tailwind e ícones baseado no nível de criticidade.
 * Facilita a manutenção, evitando múltiplos "if/else" no JSX.
 */
const estiloCriticidade: Record<Criticidade, { corBorda: string; corFundo: string; corTexto: string; Icone: LucideIcon }> = {
  alta: {
    corBorda: 'border-red-500',
    corFundo: 'bg-red-50',
    corTexto: 'text-red-700',
    Icone: AlertCircle,
  },
  media: {
    corBorda: 'border-amber-500',
    corFundo: 'bg-amber-50',
    corTexto: 'text-amber-700',
    Icone: AlertTriangle,
  },
  baixa: {
    corBorda: 'border-blue-500',
    corFundo: 'bg-blue-50',
    corTexto: 'text-blue-700',
    Icone: Info,
  },
};

/**
 * IshikawaCard Component
 * * Renderiza um cartão estilizado com borda lateral grossa indicando o status.
 * Utiliza flexbox para alinhamento interno e transições suaves de hover.
 * * @param {IshikawaCardProps} props - Propriedades do componente.
 * @returns {JSX.Element} O elemento do card renderizado.
 */
export default function IshikawaCard({
  titulo,
  causaPrincipal,
  criticidade,
  subCausas = [],
  onClick,
}: IshikawaCardProps) {
  const configVisual = estiloCriticidade[criticidade];
  const IconeAtual = configVisual.Icone;

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full rounded-lg bg-white shadow-sm border border-gray-200 
        border-l-4 ${configVisual.corBorda}
        p-4 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}
      `}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Cabeçalho do Card: Ícone e Título */}
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-full ${configVisual.corFundo} ${configVisual.corTexto} mr-3`}>
          <IconeAtual size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
      </div>

      {/* Corpo: Causa Principal */}
      <div className="mb-3">
        <p className="text-gray-700 font-medium">{causaPrincipal}</p>
      </div>

      {/* Rodapé: Lista de Subcausas (renderizada apenas se houver itens) */}
      {subCausas.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            {subCausas.map((subCausa, index) => (
              <li key={index} className="truncate" title={subCausa}>
                {subCausa}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}