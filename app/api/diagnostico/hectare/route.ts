import { NextResponse } from 'next/server';
import { mockHectare } from '@/services/apiEducampo/mocks';

export async function POST(request: Request) {
  try {
    // Extrai os dados enviados pelo frontend (será usado futuramente pela IA real)
    const _body = await request.json();
    
    // Simula o tempo de resposta da LLM (900ms)
    await new Promise((resolve) => setTimeout(resolve, 900));
    
    // Retorna o diagnóstico focado em Produtividade por Hectare
    return NextResponse.json(mockHectare);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
