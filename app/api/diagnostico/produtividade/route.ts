import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Obtém as credenciais do servidor a partir do .env
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '';
    const apiToken = process.env.API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';
    
    const response = await fetch(`${apiUrl}/api/diagnostico/produtividade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiToken,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro na API real: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Educampo Proxy] Erro em Produtividade:', error);
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
