import React from 'react';

export type Severidade = 'alta' | 'media' | 'baixa';

export interface IshikawaCardProps {
  icone: string;
  titulo: string;
  tagStatus: string;
  impacto: number;
  causas: { text: string; severity: Severidade }[];
}

const coresSeveridade: Record<Severidade, { badge: string; bullet: string }> = {
  alta: { badge: 'bg-red-100 text-red-700', bullet: 'bg-red-500' },
  media: { badge: 'bg-amber-100 text-amber-700', bullet: 'bg-amber-500' },
  baixa: { badge: 'bg-emerald-100 text-emerald-700', bullet: 'bg-emerald-500' },
};

export default function IshikawaCard({ icone, titulo, tagStatus, impacto, causas }: IshikawaCardProps) {
  // Define a cor principal do card baseada no impacto geral
  const corImpacto = impacto > 70 ? 'text-red-600' : impacto > 40 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{icone}</span>
            <h3 className="text-lg font-bold text-slate-800">{titulo}</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider">
            {tagStatus}
          </span>
        </div>
        <div className={`text-2xl font-black ${corImpacto}`}>
          {impacto}%
        </div>
      </div>

      {/* Lista de Causas */}
      <div className="mt-2 flex-1">
        {causas.length > 0 ? (
          <ul className="space-y-3">
            {causas.map((causa, index) => {
              const cor = coresSeveridade[causa.severity];
              return (
                <li key={index} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-2 flex-1 pt-1">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cor.bullet}`}></div>
                    <span className="text-slate-600 font-medium leading-tight">{causa.text}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest shrink-0 ${cor.badge}`}>
                    {causa.severity}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic mt-2">Nenhuma causa identificada.</p>
        )}
      </div>
    </div>
  );
}