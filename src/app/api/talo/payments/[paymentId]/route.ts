import { NextRequest, NextResponse } from 'next/server';
import { getTaloPayment, updateTaloPaymentMetadata } from '@/lib/talo';
import type { TaloPaymentDetailResponse, TaloUpdateMetadataRequest, TaloUpdateMetadataResponse } from '@/types/talo';

export async function GET(_request: NextRequest, context: { params: { paymentId: string } }): Promise<NextResponse<TaloPaymentDetailResponse | { error: string }>> {
  try {
    const { paymentId } = context.params;
    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId es requerido' }, { status: 400 });
    }
    const data = await getTaloPayment(paymentId);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido consultando pago';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { paymentId: string } }): Promise<NextResponse<TaloUpdateMetadataResponse | { error: string }>> {
  try {
    const { paymentId } = context.params;
    const body = (await request.json()) as TaloUpdateMetadataRequest;
    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId es requerido' }, { status: 400 });
    }
    if (!body?.motive) {
      return NextResponse.json({ error: 'motive es requerido' }, { status: 400 });
    }
    const updated = await updateTaloPaymentMetadata(paymentId, body);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido actualizando metadatos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


