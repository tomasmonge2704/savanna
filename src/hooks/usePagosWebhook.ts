import { useState, useEffect, useCallback } from 'react';
import type { Pago } from '@/types/pago';

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface FiltrosPago {
  search: string;
  estado_pago: string;
  tipo_pago: string;
  montoMin: number | null;
  montoMax: number | null;
  fechaInicio: string;
  fechaFin: string;
}

interface UsePagosWebhookReturn {
  pagos: Pago[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  filtros: FiltrosPago;
  fetchPagos: (page?: number, pageSize?: number, filtros?: FiltrosPago) => Promise<void>;
  setFiltros: (filtros: FiltrosPago) => void;
  refreshPagos: () => Promise<void>;
  conectarWebhook: () => void;
  desconectarWebhook: () => void;
  webhookConnected: boolean;
}

/**
 * Hook para manejar pagos recibidos por webhook de Talo
 * Incluye polling para actualizaciones en tiempo real y manejo de estado
 */
const usePagosWebhook = (): UsePagosWebhookReturn => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webhookConnected, setWebhookConnected] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  const [filtros, setFiltrosState] = useState<FiltrosPago>({
    search: '',
    estado_pago: '',
    tipo_pago: '',
    montoMin: null,
    montoMax: null,
    fechaInicio: '',
    fechaFin: ''
  });

  /**
   * Función para obtener pagos del servidor
   */
  const fetchPagos = useCallback(async (
    page: number = pagination.page,
    pageSize: number = pagination.pageSize,
    filtrosPago: FiltrosPago = filtros
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construir parámetros de consulta
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (filtrosPago.search) {
        params.append('search', filtrosPago.search);
      }

      if (filtrosPago.estado_pago) {
        params.append('estado_pago', filtrosPago.estado_pago);
      }

      if (filtrosPago.tipo_pago) {
        params.append('tipo_pago', filtrosPago.tipo_pago);
      }

      if (filtrosPago.montoMin !== null) {
        params.append('montoMin', filtrosPago.montoMin.toString());
      }

      if (filtrosPago.montoMax !== null) {
        params.append('montoMax', filtrosPago.montoMax.toString());
      }

      if (filtrosPago.fechaInicio) {
        params.append('fechaInicio', filtrosPago.fechaInicio);
      }

      if (filtrosPago.fechaFin) {
        params.append('fechaFin', filtrosPago.fechaFin);
      }

      const response = await fetch(`/api/pagos?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al cargar pagos');
      }

      const result = await response.json();

      setPagos(result.data || []);
      setPagination(result.pagination || {
        total: 0,
        page: page,
        pageSize: pageSize,
        totalPages: 0
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al obtener pagos:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filtros]);

  /**
   * Función para actualizar filtros
   */
  const setFiltros = useCallback((nuevosFiltros: FiltrosPago) => {
    setFiltrosState(nuevosFiltros);
    // Resetear a la primera página cuando cambian los filtros
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Función para refrescar pagos (útil después de un webhook)
   */
  const refreshPagos = useCallback(async () => {
    await fetchPagos();
  }, [fetchPagos]);

  /**
   * Conectar webhook - inicia polling para simular conexión en tiempo real
   */
  const conectarWebhook = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Polling cada 30 segundos para obtener nuevos pagos
    const interval = setInterval(() => {
      fetchPagos(1, pagination.pageSize, filtros);
    }, 30000);

    setPollingInterval(interval);
    setWebhookConnected(true);
  }, [fetchPagos, pagination.pageSize, filtros]);

  /**
   * Desconectar webhook
   */
  const desconectarWebhook = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setWebhookConnected(false);
  }, [pollingInterval]);

  // Effect para limpiar el polling al desmontar el componente
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Effect para cargar pagos iniciales
  useEffect(() => {
    fetchPagos();
  }, []);

  // Effect para recargar cuando cambian filtros o paginación
  useEffect(() => {
    fetchPagos();
  }, [filtros, pagination.page, pagination.pageSize]);

  return {
    pagos,
    loading,
    error,
    pagination,
    filtros,
    fetchPagos,
    setFiltros,
    refreshPagos,
    conectarWebhook,
    desconectarWebhook,
    webhookConnected
  };
};

export default usePagosWebhook;
