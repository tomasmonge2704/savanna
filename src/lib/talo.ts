import type {
  TaloCreatePaymentRequest,
  TaloCreatePaymentResponse,
  TaloPaymentDetailResponse,
  TaloSimulatePaymentRequest,
  TaloUpdateMetadataRequest,
  TaloUpdateMetadataResponse,
} from '@/types/talo';

const TALO_BASE_URL = process.env.NEXT_PUBLIC_TALO_ENV === 'prod'
  ? 'https://api.talo.com.ar'
  : 'https://sandbox-api.talo.com.ar';

const TALO_TOKEN = process.env.TALO_TOKEN || process.env.NEXT_PUBLIC_TALO_TOKEN || '';

function assertEnvPresent(name: string): void {
  if (!name) {
    throw new Error('Missing Talo API token. Set TALO_TOKEN or NEXT_PUBLIC_TALO_TOKEN');
  }
}

assertEnvPresent(TALO_TOKEN);

async function taloFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${TALO_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${TALO_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Talo API error (${response.status}): ${text}`);
  }
  return (await response.json()) as T;
}

export async function createTaloPayment(payload: TaloCreatePaymentRequest): Promise<TaloCreatePaymentResponse> {
  return await taloFetch<TaloCreatePaymentResponse>('/payments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTaloPayment(paymentId: string): Promise<TaloPaymentDetailResponse> {
  return await taloFetch<TaloPaymentDetailResponse>(`/payments/${paymentId}`);
}

export async function updateTaloPaymentMetadata(paymentId: string, payload: TaloUpdateMetadataRequest): Promise<TaloUpdateMetadataResponse> {
  return await taloFetch<TaloUpdateMetadataResponse>(`/payments/${paymentId}/metadata`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function simulateTaloPayment(cvu: string, payload: TaloSimulatePaymentRequest): Promise<{ message: string } | Record<string, unknown>> {
  return await taloFetch(`/cvu/${cvu}/faucet`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


