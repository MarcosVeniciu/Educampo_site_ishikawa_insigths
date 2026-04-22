import { NextResponse } from 'next/server';
import { mockTrabalhador } from '@/services/apiEducampo/mocks';

export async function POST(request: Request) {
  try {
    // Extrai os dados enviados pelo frontend (será usado futuramente pela IA real)
    const _body = await request.json();
    
    // Simula o tempo de resposta da LLM (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Retorna o diagnóstico focado em Mão de Obra
    return NextResponse.json(mockTrabalhador);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
