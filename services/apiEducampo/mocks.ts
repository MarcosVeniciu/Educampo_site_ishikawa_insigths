import { DiagramaSaida } from './types';

/**
 * Mock de resposta para o diagnóstico de Eficiência do Trabalhador.
 * Baseado no ficheiro: ishikawa-trabalhador-6m.pdf
 */
export const mockTrabalhador: DiagramaSaida = {
  categories: [
    {
      id: "mao-de-obra",
      label: "Mão de Obra",
      emoji: "👥",
      impact: 83,
      tag: "Principal fator limitante",
      causes: [
        {
          text: "Trabalhador sem qualificação técnica para ordenha e manejo",
          severity: "alta",
          detail: "Um ordenhador treinado em sala de ordenha canaleta consegue operar 60-80 vacas/hora. Sem treinamento, dificilmente supera 20-25 vacas/hora."
        },
        {
          text: "Número excessivo de funcionários para o tamanho do rebanho",
          severity: "alta",
          detail: "O L/trabalhador/dia é calculado dividindo a produção total pelo número de funcionários. O excesso dilui a eficiência individual."
        },
        {
          text: "Alta rotatividade com perda contínua de habilidades",
          severity: "alta",
          detail: "Um ordenhador leva 30-60 dias para atingir plena eficiência. Altas taxas de demissão impedem a consolidação de processos."
        },
        {
          text: "Ausência de definição clara de tarefas por turno",
          severity: "media",
          detail: "Sem escala de trabalho e lista de tarefas clara, ocorrem sobreposições e esquecimentos de rotinas críticas."
        }
      ]
    },
    {
      id: "metodo",
      label: "Método",
      emoji: "📋",
      impact: 74,
      tag: "2º maior impacto",
      causes: [
        {
          text: "Ausência de protocolo escrito de ordenha com tempo padrão",
          severity: "alta",
          detail: "Um protocolo padronizado reduz o tempo de ordenha em até 25% e melhora a descida do leite."
        },
        {
          text: "Rotina de trabalho sem organização de fluxo",
          severity: "alta",
          detail: "Funcionários que precisam buscar insumos no meio da ordenha geram retrabalho e esperas desnecessárias."
        }
      ]
    }
  ]
};

/**
 * Mock de resposta para o diagnóstico de Produção por Hectare.
 * Baseado no ficheiro: ishikawa-hectare-6m.pdf
 */
export const mockHectare: DiagramaSaida = {
  categories: [
    {
      id: "mao-de-obra",
      label: "Mão de Obra",
      emoji: "👥",
      impact: 82,
      tag: "Principal fator limitante",
      causes: [
        {
          text: "Manejo do pastejo sem critério técnico de altura",
          severity: "alta",
          detail: "Sem critério de altura de entrada e saída, o pasto é subaproveitado ou degradado, reduzindo o leite por área."
        },
        {
          text: "Mão de obra sem treinamento em pastejo rotacionado",
          severity: "alta",
          detail: "O pastejo rotacionado exige disciplina operacional rigorosa para respeitar o tempo de descanso dos piquetes."
        }
      ]
    },
    {
      id: "material",
      label: "Material",
      emoji: "🌱",
      impact: 68,
      tag: "Base da produção forrageira",
      causes: [
        {
          text: "Adubação de manutenção ausente ou subdosada",
          severity: "alta",
          detail: "A falta de reposição de nutrientes (N, P, K) exaure o solo e reduz a produção de matéria seca por hectare."
        },
        {
          text: "Forrageira inadequada para o solo e clima",
          severity: "alta",
          detail: "Cultivares inadaptadas produzem menos massa verde, limitando a capacidade de suporte (UA/ha) da terra."
        }
      ]
    }
  ]
};

/**
 * Mock de resposta para o diagnóstico de Produtividade por Vaca.
 * Baseado no ficheiro: ishikawa-produtividade.pdf
 */
export const mockProdutividade: DiagramaSaida = {
  categories: [
    {
      id: "nutricao",
      label: "Nutrição",
      emoji: "🌾",
      impact: 82,
      tag: "Principal fator limitante",
      causes: [
        {
          text: "Dieta com déficit energético (NDT abaixo do requerido)",
          severity: "alta",
          detail: "Vacas em pico de lactação necessitam de alta energia. Déficits acima de 15% reduzem drasticamente o pico de produção."
        },
        {
          text: "Proteína bruta insuficiente para suporte à lactação",
          severity: "alta",
          detail: "PB abaixo de 16% na MS compromete a produção de leite, a imunidade e a performance reprodutiva."
        }
      ]
    },
    {
      id: "saude",
      label: "Saúde Animal",
      emoji: "🩺",
      impact: 65,
      tag: "Fator de perda direta",
      causes: [
        {
          text: "CCS elevada reduz a produção individual",
          severity: "alta",
          detail: "A mastite subclínica desvia nutrientes para o combate à infeção, reduzindo o volume de leite em até 15%."
        }
      ]
    }
  ]
};

/**
 * Mock de resposta para o diagnóstico de Saúde (CCS).
 * Baseado no ficheiro: ishikawa-ccs.pdf
 */
export const mockCcs: DiagramaSaida = {
  categories: [
    {
      id: "mao-de-obra",
      label: "Mão de Obra",
      emoji: "👥",
      impact: 85,
      tag: "Principal fator de risco",
      causes: [
        {
          text: "Ordenha realizada sem treinamento adequado",
          severity: "alta",
          detail: "Técnica incorreta de estimulação e retirada favorece lesões no teto e entrada de patógenos."
        },
        {
          text: "Higiene das mãos ausente entre vacas",
          severity: "alta",
          detail: "Esta é a principal via de transmissão de mastite contagiosa durante a rotina de ordenha."
        }
      ]
    },
    {
      id: "metodo",
      label: "Método",
      emoji: "📋",
      impact: 72,
      tag: "2º maior impacto",
      causes: [
        {
          text: "Ausência ou irregularidade do pré-dipping",
          severity: "alta",
          detail: "O pré-dipping reduz em até 50% a contaminação do teto antes do acoplamento das teteiras."
        },
        {
          text: "Pós-dipping não realizado sistematicamente",
          severity: "alta",
          detail: "O selante após a ordenha é crucial para fechar o esfíncter do teto e prevenir infeções ambientais."
        }
      ]
    }
  ]
};