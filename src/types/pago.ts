export type Pago = {
  id: string;
  usuario_id: string;
  usuario_nombre?: string;
  usuario_email?: string;
  monto: number;
  moneda: string;
  estado_pago: string;
  tipo_pago: string;
  referencia_externa?: string;
  webhook_data?: any;
  fecha_pago: string;
  created_at: string;
  updated_at?: string;
  descripcion?: string;
  metodo_pago?: string;
  comision?: number;
  monto_neto?: number;
  // Campos específicos de Talo
  talo_payment_id?: string;
  cvu?: string;
  alias?: string;
  payment_url?: string;
  sender_name?: string;
  sender_bank?: string;
  sender_account?: string;
  transaction_id?: string;
  webhook_event?: string;
};
