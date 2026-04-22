import { NextResponse } from 'next/server';
import { mockProdutividade } from '@/services/apiEducampo/mocks';

export async function POST(request: Request) {
  try {
    // Extrai os dados enviados pelo frontend (será usado futuramente pela IA real)
    const _body = await request.json();
    
    // Simula o tempo de resposta da LLM (700ms)
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    // Retorna o diagnóstico focado em Produtividade por Vaca
    return NextResponse.json(mockProdutividade);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
