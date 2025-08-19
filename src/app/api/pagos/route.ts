import { NextRequest, NextResponse } from 'next/server';
import type { Pago } from '@/types/pago';

// Mock data para simular pagos recibidos por webhook de Talo
const pagosMock: Pago[] = [
  {
    id: '1',
    usuario_id: 'user-001',
    usuario_nombre: 'Juan Pérez',
    usuario_email: 'juan@ejemplo.com',
    monto: 25000,
    moneda: 'ARS',
    estado_pago: 'completado',
    tipo_pago: 'transferencia',
    referencia_externa: 'TALO-001',
    fecha_pago: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z',
    descripcion: 'Pago de inscripción',
    metodo_pago: 'Transferencia Bancaria',
    comision: 500,
    monto_neto: 24500,
    talo_payment_id: 'talo_pay_123456',
    cvu: '0000003100010000000001',
    alias: 'JUAN.PEREZ.MP',
    sender_name: 'María García',
    sender_bank: 'Banco Santander',
    sender_account: '****1234',
    transaction_id: 'TXN789123',
    webhook_event: 'payment.completed'
  },
  {
    id: '2',
    usuario_id: 'user-002',
    usuario_nombre: 'Ana López',
    usuario_email: 'ana@ejemplo.com',
    monto: 15000,
    moneda: 'ARS',
    estado_pago: 'pendiente',
    tipo_pago: 'transferencia',
    referencia_externa: 'TALO-002',
    fecha_pago: '2024-01-15T14:20:00Z',
    created_at: '2024-01-15T14:20:00Z',
    descripcion: 'Pago cuota mensual',
    metodo_pago: 'Transferencia Bancaria',
    comision: 300,
    monto_neto: 14700,
    talo_payment_id: 'talo_pay_789012',
    cvu: '0000003100010000000002',
    alias: 'ANA.LOPEZ.MP',
    webhook_event: 'payment.pending'
  },
  {
    id: '3',
    usuario_id: 'user-003',
    usuario_nombre: 'Carlos Rodríguez',
    usuario_email: 'carlos@ejemplo.com',
    monto: 50000,
    moneda: 'ARS',
    estado_pago: 'fallido',
    tipo_pago: 'transferencia',
    referencia_externa: 'TALO-003',
    fecha_pago: '2024-01-14T16:45:00Z',
    created_at: '2024-01-14T16:45:00Z',
    descripcion: 'Pago evento especial',
    metodo_pago: 'Transferencia Bancaria',
    comision: 1000,
    monto_neto: 49000,
    talo_payment_id: 'talo_pay_345678',
    cvu: '0000003100010000000003',
    alias: 'CARLOS.ROD.MP',
    webhook_event: 'payment.failed'
  },
  {
    id: '4',
    usuario_id: 'user-004',
    usuario_nombre: 'Laura Fernández',
    usuario_email: 'laura@ejemplo.com',
    monto: 35000,
    moneda: 'ARS',
    estado_pago: 'completado',
    tipo_pago: 'transferencia',
    referencia_externa: 'TALO-004',
    fecha_pago: '2024-01-13T09:15:00Z',
    created_at: '2024-01-13T09:15:00Z',
    descripcion: 'Pago membresía anual',
    metodo_pago: 'Transferencia Bancaria',
    comision: 700,
    monto_neto: 34300,
    talo_payment_id: 'talo_pay_901234',
    cvu: '0000003100010000000004',
    alias: 'LAURA.FERN.MP',
    sender_name: 'Pedro Morales',
    sender_bank: 'Banco Galicia',
    sender_account: '****5678',
    transaction_id: 'TXN456789',
    webhook_event: 'payment.completed'
  },
  {
    id: '5',
    usuario_id: 'user-005',
    usuario_nombre: 'Diego Silva',
    usuario_email: 'diego@ejemplo.com',
    monto: 20000,
    moneda: 'ARS',
    estado_pago: 'reembolsado',
    tipo_pago: 'transferencia',
    referencia_externa: 'TALO-005',
    fecha_pago: '2024-01-12T13:30:00Z',
    created_at: '2024-01-12T13:30:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    descripcion: 'Pago de curso - reembolsado',
    metodo_pago: 'Transferencia Bancaria',
    comision: 400,
    monto_neto: 19600,
    talo_payment_id: 'talo_pay_567890',
    cvu: '0000003100010000000005',
    alias: 'DIEGO.SILVA.MP',
    webhook_event: 'payment.refunded'
  }
];

/**
 * GET /api/pagos
 * Obtiene la lista de pagos con filtros y paginación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // Parámetros de filtros
    const search = searchParams.get('search') || '';
    const estado_pago = searchParams.get('estado_pago') || '';
    const tipo_pago = searchParams.get('tipo_pago') || '';
    const montoMin = searchParams.get('montoMin') ? parseInt(searchParams.get('montoMin')!) : null;
    const montoMax = searchParams.get('montoMax') ? parseInt(searchParams.get('montoMax')!) : null;
    const fechaInicio = searchParams.get('fechaInicio') || '';
    const fechaFin = searchParams.get('fechaFin') || '';

    let pagosFiltrados = [...pagosMock];

    // Aplicar filtro de búsqueda
    if (search) {
      pagosFiltrados = pagosFiltrados.filter(pago =>
        pago.usuario_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        pago.usuario_email?.toLowerCase().includes(search.toLowerCase()) ||
        pago.referencia_externa?.toLowerCase().includes(search.toLowerCase()) ||
        pago.talo_payment_id?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar filtro de estado
    if (estado_pago) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.estado_pago === estado_pago);
    }

    // Aplicar filtro de tipo de pago
    if (tipo_pago) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.tipo_pago === tipo_pago);
    }

    // Aplicar filtros de monto
    if (montoMin !== null) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.monto >= montoMin);
    }

    if (montoMax !== null) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.monto <= montoMax);
    }

    // Aplicar filtros de fecha
    if (fechaInicio) {
      pagosFiltrados = pagosFiltrados.filter(pago => 
        new Date(pago.fecha_pago) >= new Date(fechaInicio)
      );
    }

    if (fechaFin) {
      pagosFiltrados = pagosFiltrados.filter(pago => 
        new Date(pago.fecha_pago) <= new Date(fechaFin)
      );
    }

    // Ordenar por fecha de pago descendente
    pagosFiltrados.sort((a, b) => 
      new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime()
    );

    // Aplicar paginación
    const total = pagosFiltrados.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagosPaginados = pagosFiltrados.slice(startIndex, endIndex);

    const resultado = {
      data: pagosPaginados,
      pagination: {
        total,
        page,
        pageSize,
        totalPages
      }
    };

    return NextResponse.json(resultado);

  } catch (error) {
    console.error('Error en GET /api/pagos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pagos
 * Simula la recepción de un webhook de Talo
 */
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    console.log('Webhook recibido de Talo:', webhookData);
    
    // Aquí procesarías el webhook real de Talo
    // Por ahora solo retornamos éxito
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook procesado correctamente' 
    });

  } catch (error) {
    console.error('Error procesando webhook de Talo:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}
