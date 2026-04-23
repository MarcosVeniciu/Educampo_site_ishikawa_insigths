import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Obtém as credenciais do servidor a partir do .env
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '';
    
    // Repassa o token original enviado pelo frontend ou faz fallback para o .env
    const clientToken = request.headers.get('x-api-token');
    const cookieHeader = request.headers.get('cookie') || '';
    const apiToken = clientToken || process.env.API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';
    
    const response = await fetch(`${apiUrl}/api/diagnostico/hectare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiToken,
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro na API real: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Educampo Proxy] Erro em Hectare:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Erro ao processar diagnóstico', details: errorMessage }, { status: 500 });
  }
}
