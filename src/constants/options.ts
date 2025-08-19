/**
 * Opciones para los selectores de género
 */
export const OPCIONES_GENERO = [
  { value: 'Hombre', label: 'Masculino' },
  { value: 'Mujer', label: 'Femenino' },
];

export const STATUS_PAID_COMPLETED = 'ya_pago';
export const STATUS_WAITING_PAYMENT = 'esperando_pago';
/**
 * Opciones para los selectores de estado
 */
export const OPCIONES_STATUS = [
  { value: STATUS_WAITING_PAYMENT, label: 'Esperando Pago', color: 'warning', label2: 'Pago pendiente', icon: 'credit-card' },
  { value: STATUS_PAID_COMPLETED, label: 'Ya Pago', color: 'success', label2: 'Pago realizado', icon: 'check-circle' },
];

/**
 * Opciones para los selectores de rol
 */
export const OPCIONES_ROL = [
  { value: 0, label: 'Administrador' },
  { value: 1, label: 'Gerente' },
  { value: 2, label: 'Supervisor' },
  { value: 3, label: 'Usuario Avanzado' },
  { value: 4, label: 'Usuario Estándar' }
];

/**
 * Función para obtener el nombre de un rol según su valor
 */
export const getRoleName = (role?: number): string => {
  if (role === undefined) return 'Sin rol';
  
  const rolEncontrado = OPCIONES_ROL.find(opcion => opcion.value === role);
  return rolEncontrado ? rolEncontrado.label : `Rol ${role}`;
};

/**
 * Función para obtener el color de un grupo
 */
export const getGrupoColor = (grupo: string): string => {
  switch (grupo) {
    case 'Administración': return 'blue';
    case 'Ventas': return 'green';
    case 'Marketing': return 'purple';
    case 'Desarrollo': return 'cyan';
    case 'Soporte': return 'orange';
    case 'Recursos Humanos': return 'pink';
    default: return 'default';
  }
};

/**
 * Estados de pago
 */
export const ESTADO_PAGO_PENDIENTE = 'pendiente';
export const ESTADO_PAGO_COMPLETADO = 'completado';
export const ESTADO_PAGO_FALLIDO = 'fallido';
export const ESTADO_PAGO_CANCELADO = 'cancelado';
export const ESTADO_PAGO_REEMBOLSADO = 'reembolsado';

/**
 * Opciones para los estados de pago
 */
export const OPCIONES_ESTADO_PAGO = [
  { value: ESTADO_PAGO_PENDIENTE, label: 'Pendiente', color: 'warning' },
  { value: ESTADO_PAGO_COMPLETADO, label: 'Completado', color: 'success' },
  { value: ESTADO_PAGO_FALLIDO, label: 'Fallido', color: 'error' },
  { value: ESTADO_PAGO_CANCELADO, label: 'Cancelado', color: 'default' },
  { value: ESTADO_PAGO_REEMBOLSADO, label: 'Reembolsado', color: 'purple' },
];

/**
 * Tipos de pago
 */
export const OPCIONES_TIPO_PAGO = [
  { value: 'tarjeta_credito', label: 'Tarjeta de Crédito', icon: 'credit-card' },
  { value: 'tarjeta_debito', label: 'Tarjeta de Débito', icon: 'credit-card' },
  { value: 'transferencia', label: 'Transferencia Bancaria', icon: 'bank' },
  { value: 'efectivo', label: 'Efectivo', icon: 'dollar' },
  { value: 'paypal', label: 'PayPal', icon: 'paypal' },
  { value: 'stripe', label: 'Stripe', icon: 'stripe' },
  { value: 'mercadopago', label: 'MercadoPago', icon: 'money-collect' },
  { value: 'otro', label: 'Otro', icon: 'wallet' },
];

/**
 * Función para obtener el color de un estado de pago
 */
export const getEstadoPagoColor = (estado: string): string => {
  const opcion = OPCIONES_ESTADO_PAGO.find(opt => opt.value === estado);
  return opcion ? opcion.color : 'default';
};

/**
 * Función para obtener el label de un tipo de pago
 */
export const getTipoPagoLabel = (tipo: string): string => {
  const opcion = OPCIONES_TIPO_PAGO.find(opt => opt.value === tipo);
  return opcion ? opcion.label : tipo;
};
