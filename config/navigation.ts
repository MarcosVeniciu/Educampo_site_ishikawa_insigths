/**
 * @fileoverview Configuração central de navegação do sistema Educampo Insights.
 * Este arquivo define a estrutura do menu lateral e as rotas baseadas na 
 * arquitetura do Next.js (App Router).
 * * Dependências esperadas:
 * - lucide-react: Para a renderização dos ícones do menu.
 */

import { 
  LayoutDashboard, 
  GitMerge, 
  TrendingUp, 
  Settings,
  LucideIcon
} from 'lucide-react';

/**
 * Interface que define a estrutura de um item de navegação no menu.
 * * @interface NavItem
 * @property {string} label - O texto que aparecerá visualmente no menu para o usuário.
 * @property {string} href - O caminho da rota (URL) para a qual o link aponta.
 * @property {LucideIcon} icon - O componente de ícone importado do lucide-react.
 * @property {string} [description] - Uma descrição opcional para uso em tooltips ou leitores de tela.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

/**
 * Array constante que contém todos os itens do menu principal (Sidebar).
 * A ordem dos itens neste array dita a ordem em que eles aparecerão na interface.
 * * Rotas mapeadas para a pasta `app/(painel)/`:
 * - /dashboard: Visão geral de negócio.
 * - /diagnostico/geral: A página dinâmica [tipo] carregando a visão 'geral' inicial dos Ishikawas.
 * - /simulacao: Área de projeção de cenários.
 * - /configuracoes: Ajustes da fazenda.
 * * @type {NavItem[]}
 */
export const navigationConfig: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral dos indicadores da fazenda e painel principal',
  },
  {
    label: 'Diagnóstico',
    href: '/diagnostico/geral', 
    icon: GitMerge, // GitMerge lembra a estrutura de espinha de peixe (causa e efeito)
    description: 'Análise detalhada de causas raiz via Diagrama de Ishikawa',
  },
  {
    label: 'Simulação',
    href: '/simulacao',
    icon: TrendingUp,
    description: 'Projeção de cenários e simulação de impactos',
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
    description: 'Ajustes de parâmetros, dados da propriedade e preferências',
  }
];

/**
 * Função utilitária para buscar a configuração de uma rota específica.
 * Útil para recuperar títulos de páginas dinamicamente no Header baseado na URL atual.
 * * @param {string} pathname - O caminho da URL atual (ex: '/dashboard').
 * @returns {NavItem | undefined} O objeto do item de navegação correspondente ou undefined se não encontrado.
 */
export const getActiveNavInfo = (pathname: string): NavItem | undefined => {
  return navigationConfig.find(item => pathname.startsWith(item.href));
};