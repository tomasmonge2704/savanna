import { NextRequest, NextResponse } from 'next/server';
import { createTaloPayment } from '@/lib/talo';
import type { TaloCreatePaymentRequest, TaloCreatePaymentResponse } from '@/types/talo';

export async function POST(request: NextRequest): Promise<NextResponse<TaloCreatePaymentResponse | { error: string }>> {
  try {
    const body = (await request.json()) as TaloCreatePaymentRequest;

    if (!body?.user_id || !body?.price?.amount || !body?.price?.currency || !Array.isArray(body?.payment_options) || !body?.external_id || !body?.webhook_url) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const created = await createTaloPayment(body);
    return NextResponse.json(created);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido creando pago';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


