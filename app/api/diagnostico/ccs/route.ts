import { NextResponse } from 'next/server';
import { mockCcs } from '@/services/apiEducampo/mocks';

export async function POST(request: Request) {
  try {
    // Extrai os dados enviados pelo frontend (será usado futuramente pela IA real)
    const _body = await request.json();
    
    // Simula o tempo de resposta da LLM (1000ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Retorna o diagnóstico focado em Saúde Animal/CCS
    return NextResponse.json(mockCcs);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
