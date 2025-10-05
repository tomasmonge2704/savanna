export type TaloCurrency = 'ARS';

export interface TaloPrice {
  amount: number;
  currency: TaloCurrency;
}

export interface TaloCreatePaymentRequest {
  user_id: string;
  price: TaloPrice;
  payment_options: string[];
  external_id: string;
  webhook_url: string;
  redirect_url?: string;
  motive?: string;
}

export type TaloPaymentStatus = 'PENDING' | 'SUCCESS' | 'OVERPAID' | 'UNDERPAID' | 'EXPIRED';

export interface TaloQuote {
  cvu?: string;
  alias?: string;
  address?: string;
  currency?: TaloCurrency;
  network?: string;
  amount?: string | number;
}

export interface TaloCreatePaymentResponse {
  data: {
    id: string;
    payment_status: TaloPaymentStatus;
    quotes: TaloQuote[];
    payment_url: string;
    expiration_timestamp: string;
  };
}

export interface TaloPaymentDetailResponse {
  message: string;
  error: boolean;
  code: number;
  data: {
    id: string;
    payment_status: TaloPaymentStatus;
    payment_url: string;
    expiration_timestamp: string;
    price: TaloPrice;
    external_id: string;
    webhook_url?: string;
    redirect_url?: string;
    motive?: string;
    quotes: TaloQuote[];
    transactions?: Array<Record<string, unknown>>;
    transaction_fields?: Record<string, unknown>;
  };
}

export interface TaloUpdateMetadataRequest {
  motive: string;
}

export interface TaloUpdateMetadataResponse {
  message: string;
  error: boolean;
  code: number;
  data: Record<string, unknown>;
}

export interface TaloSimulatePaymentRequest {
  amount: number;
}

export interface TaloWebhookPayload {
  message: string;
  paymentId: string;
  externalId: string;
}


