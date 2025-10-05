import { NextRequest, NextResponse } from 'next/server';
import type { TaloWebhookPayload } from '@/types/talo';

const TALO_WEBHOOK_SECRET = process.env.TALO_WEBHOOK_SECRET || '';

function isAuthorized(request: NextRequest): boolean {
  if (!TALO_WEBHOOK_SECRET) return true;
  const provided = request.headers.get('x-talo-webhook-secret');
  return provided === TALO_WEBHOOK_SECRET;
}

export async function POST(request: NextRequest): Promise<NextResponse<{ ok: boolean } | { error: string }>> {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await request.json()) as TaloWebhookPayload;
    console.log('Webhook Talo recibido:', payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido en webhook';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


