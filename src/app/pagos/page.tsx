'use client';

import { Table, Card, Space, Tag, Pagination, Input as AntInput, Row, Col, Button, Form, Select, DatePicker, Modal, Badge } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, FilterOutlined, ClearOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { Pago } from '@/types/pago';
import { ColumnsType } from 'antd/es/table';
import { 
  OPCIONES_ESTADO_PAGO, 
  OPCIONES_TIPO_PAGO,
  getEstadoPagoColor,
  getTipoPagoLabel
} from '@/constants/options';
import { isMobile } from 'react-device-detect';
import { convertirMoneda } from '../utils/convertirMoneda';
import NotificacionAlerta from '@/components/NotificacionAlerta';
import useAlerta from '@/hooks/useAlerta';
import usePagosWebhook from '@/hooks/usePagosWebhook';
import dayjs from 'dayjs';

const { Option } = Select;
const { Search } = AntInput;
const { RangePicker } = DatePicker;

export default function PagosPage() {
  const [isBrowser, setIsBrowser] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [pagoDetalle, setPagoDetalle] = useState<Pago | null>(null);
  const [formFiltros] = Form.useForm();
  
  const { alerta, mostrarExito, mostrarError, ocultarAlerta } = useAlerta();
  
  const {
    pagos,
    loading,
    error,
    pagination,
    filtros,
    setFiltros,
    refreshPagos,
    webhookConnected
  } = usePagosWebhook();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (error) {
      mostrarError(error);
    }
  }, [error]);

  const handlePageChange = (page: number, pageSize?: number) => {
    // La lógica de paginación se maneja en el hook
  };

  const handleSearch = (value: string) => {
    setFiltros({
      ...filtros,
      search: value
    });
  };
  
  const toggleFiltros = () => {
    setFiltrosVisibles(!filtrosVisibles);
  };
  
  const aplicarFiltros = (values: any) => {
    const rangoFechas = values.rangoFechas;
    setFiltros({
      ...filtros,
      estado_pago: values.estado_pago || '',
      tipo_pago: values.tipo_pago || '',
      montoMin: values.rangoMonto ? values.rangoMonto[0] : null,
      montoMax: values.rangoMonto ? values.rangoMonto[1] : null,
      fechaInicio: rangoFechas && rangoFechas[0] ? rangoFechas[0].format('YYYY-MM-DD') : '',
      fechaFin: rangoFechas && rangoFechas[1] ? rangoFechas[1].format('YYYY-MM-DD') : ''
    });
  };
  
  const limpiarFiltros = () => {
    formFiltros.resetFields();
    setFiltros({
      search: filtros.search, // Mantener la búsqueda por texto
      estado_pago: '',
      tipo_pago: '',
      montoMin: null,
      montoMax: null,
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const handleRefresh = async () => {
    try {
      await refreshPagos();
      mostrarExito('Pagos actualizados correctamente');
    } catch (error) {
      mostrarError('Error al actualizar pagos');
    }
  };

  const handleVerDetalle = (pago: Pago) => {
    setPagoDetalle(pago);
  };

  const columnas: ColumnsType<Pago> = [
    {
      title: 'Fecha',
      dataIndex: 'fecha_pago',
      key: 'fecha_pago',
      render: (fecha: string) => (
        <div style={{ fontSize: '12px' }}>
          {dayjs(fecha).format('DD/MM/YYYY')}
          <br />
          <span style={{ color: '#666' }}>
            {dayjs(fecha).format('HH:mm')}
          </span>
        </div>
      ),
      sorter: (a: Pago, b: Pago) => new Date(a.fecha_pago).getTime() - new Date(b.fecha_pago).getTime(),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 100,
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario_nombre',
      key: 'usuario_nombre',
      render: (text: string, record: Pago) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.usuario_email}
          </div>
        </div>
      ),
      sorter: (a: Pago, b: Pago) => (a.usuario_nombre || '').localeCompare(b.usuario_nombre || ''),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto: number, record: Pago) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {convertirMoneda(monto)}
          </div>
          {record.comision && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Comisión: {convertirMoneda(record.comision)}
            </div>
          )}
        </div>
      ),
      sorter: (a: Pago, b: Pago) => (a.monto || 0) - (b.monto || 0),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Estado',
      dataIndex: 'estado_pago',
      key: 'estado_pago',
      render: (estado: string) => {
        const opcion = OPCIONES_ESTADO_PAGO.find(opt => opt.value === estado);
        const color = opcion?.color || 'default';
        return <Tag color={color}>{opcion?.label || estado}</Tag>;
      },
      sorter: (a: Pago, b: Pago) => a.estado_pago.localeCompare(b.estado_pago),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Método',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      render: (tipo: string) => (
        <Tag color="blue">
          {getTipoPagoLabel(tipo)}
        </Tag>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Talo ID',
      dataIndex: 'talo_payment_id',
      key: 'talo_payment_id',
      render: (id: string) => (
        <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          {id?.substring(0, 12)}...
        </div>
      ),
      responsive: ['lg', 'xl'],
    },
    {
      title: 'CVU/Alias',
      render: (_, record: Pago) => (
        <div style={{ fontSize: '12px' }}>
          {record.alias && (
            <div>
              <Tag color="green">{record.alias}</Tag>
            </div>
          )}
          {record.cvu && (
            <div style={{ color: '#666', fontFamily: 'monospace' }}>
              {record.cvu.substring(0, 8)}...
            </div>
          )}
        </div>
      ),
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text"
            icon={<EyeOutlined />} 
            onClick={() => handleVerDetalle(record)}
            size="small"
            title="Ver detalles"
          />
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 80,
    },
  ];

  // Renderizar los filtros activos como tags
  const renderFiltrosActivos = () => {
    const tags = [];
    
    if (filtros.estado_pago) {
      const opcion = OPCIONES_ESTADO_PAGO.find(opt => opt.value === filtros.estado_pago);
      tags.push(
        <Tag key="estado" closable onClose={() => setFiltros({ ...filtros, estado_pago: '' })}>
          Estado: {opcion?.label}
        </Tag>
      );
    }
    
    if (filtros.tipo_pago) {
      tags.push(
        <Tag key="tipo" closable onClose={() => setFiltros({ ...filtros, tipo_pago: '' })}>
          Tipo: {getTipoPagoLabel(filtros.tipo_pago)}
        </Tag>
      );
    }
    
    if (filtros.montoMin !== null || filtros.montoMax !== null) {
      tags.push(
        <Tag key="monto" closable onClose={() => setFiltros({ ...filtros, montoMin: null, montoMax: null })}>
          Monto: ${filtros.montoMin || 0} - ${filtros.montoMax || 100000}
        </Tag>
      );
    }

    if (filtros.fechaInicio || filtros.fechaFin) {
      tags.push(
        <Tag key="fecha" closable onClose={() => setFiltros({ ...filtros, fechaInicio: '', fechaFin: '' })}>
          Fecha: {filtros.fechaInicio} - {filtros.fechaFin}
        </Tag>
      );
    }
    
    return tags.length > 0 ? (
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Filtros activos:</span>
        {tags}
        {tags.length > 0 && (
          <Button size="small" onClick={limpiarFiltros} icon={<ClearOutlined />} style={{ marginLeft: 8 }}>
            Limpiar todos
          </Button>
        )}
      </div>
    ) : null;
  };

  return (
    <Card> 
      {/* Componente NotificacionAlerta */}
      <NotificacionAlerta
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        visible={alerta.visible}
        onClose={ocultarAlerta}
        duracion={5000}
      />
      
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Search
              placeholder="Buscar por usuario, email o ID de Talo"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} md={16} style={{ display: 'flex', justifyContent: isBrowser && isMobile ? 'center' : 'flex-end' }}>
            <Space wrap>
              <Button 
                onClick={toggleFiltros}
                icon={<FilterOutlined />}
                type={filtrosVisibles ? "primary" : "default"}
              >
                Filtros
              </Button>
              <Button 
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
                loading={loading}
              >
                Actualizar
              </Button>
              <Badge 
                status={webhookConnected ? 'success' : 'default'} 
                text={webhookConnected ? 'Conectado' : 'Desconectado'} 
              />
            </Space>
          </Col>
        </Row>
      </div>
      
      {filtrosVisibles && (
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={formFiltros}
            layout="vertical"
            onFinish={aplicarFiltros}
            initialValues={{
              estado_pago: filtros.estado_pago,
              tipo_pago: filtros.tipo_pago,
              rangoMonto: filtros.montoMin !== null && filtros.montoMax !== null ? [filtros.montoMin, filtros.montoMax] : undefined,
              rangoFechas: filtros.fechaInicio && filtros.fechaFin ? [dayjs(filtros.fechaInicio), dayjs(filtros.fechaFin)] : undefined
            }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="estado_pago" label="Estado">
                  <Select placeholder="Selecciona un estado" allowClear>
                    {OPCIONES_ESTADO_PAGO.map(opcion => (
                      <Option key={opcion.value} value={opcion.value}>{opcion.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="tipo_pago" label="Tipo de Pago">
                  <Select placeholder="Selecciona un tipo" allowClear>
                    {OPCIONES_TIPO_PAGO.map(opcion => (
                      <Option key={opcion.value} value={opcion.value}>{opcion.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="rangoFechas" label="Rango de Fechas">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="rangoMonto" label="Rango de Monto">
                  <Select 
                    mode="tags" 
                    placeholder="Ej: 1000,50000"
                    maxTagCount={2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Space>
                <Button onClick={limpiarFiltros}>
                  Limpiar
                </Button>
                <Button type="primary" htmlType="submit">
                  Aplicar filtros
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>
      )}
      
      {renderFiltrosActivos()}
      
      <Table
        dataSource={pagos} 
        columns={columnas} 
        rowKey="id" 
        pagination={false}
        loading={loading}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
        size="middle"
      />
      
      {/* Componente de paginación */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Pagination
          current={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          showTotal={!isBrowser || !isMobile ? (total, range) => `${range[0]}-${range[1]} de ${total} pagos` : undefined}
          responsive={true}
          size={isBrowser && isMobile ? "small" : "default"}
        />
      </div>

      {/* Modal para ver detalles del pago */}
      <Modal
        title="Detalles del Pago"
        open={!!pagoDetalle}
        onCancel={() => setPagoDetalle(null)}
        footer={[
          <Button key="close" onClick={() => setPagoDetalle(null)}>
            Cerrar
          </Button>
        ]}
        width={800}
      >
        {pagoDetalle && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>ID de Talo:</strong><br />
                <code>{pagoDetalle.talo_payment_id}</code>
              </Col>
              <Col span={12}>
                <strong>Referencia Externa:</strong><br />
                {pagoDetalle.referencia_externa}
              </Col>
              <Col span={12}>
                <strong>Usuario:</strong><br />
                {pagoDetalle.usuario_nombre} ({pagoDetalle.usuario_email})
              </Col>
              <Col span={12}>
                <strong>Estado:</strong><br />
                <Tag color={getEstadoPagoColor(pagoDetalle.estado_pago)}>
                  {OPCIONES_ESTADO_PAGO.find(opt => opt.value === pagoDetalle.estado_pago)?.label}
                </Tag>
              </Col>
              <Col span={12}>
                <strong>Monto:</strong><br />
                {convertirMoneda(pagoDetalle.monto)} {pagoDetalle.moneda}
              </Col>
              <Col span={12}>
                <strong>Comisión:</strong><br />
                {pagoDetalle.comision ? convertirMoneda(pagoDetalle.comision) : 'N/A'}
              </Col>
              <Col span={12}>
                <strong>Monto Neto:</strong><br />
                {pagoDetalle.monto_neto ? convertirMoneda(pagoDetalle.monto_neto) : 'N/A'}
              </Col>
              <Col span={12}>
                <strong>Fecha de Pago:</strong><br />
                {dayjs(pagoDetalle.fecha_pago).format('DD/MM/YYYY HH:mm:ss')}
              </Col>
              {pagoDetalle.cvu && (
                <Col span={24}>
                  <strong>CVU:</strong><br />
                  <code>{pagoDetalle.cvu}</code>
                </Col>
              )}
              {pagoDetalle.alias && (
                <Col span={24}>
                  <strong>Alias:</strong><br />
                  <Tag color="green">{pagoDetalle.alias}</Tag>
                </Col>
              )}
              {pagoDetalle.sender_name && (
                <Col span={12}>
                  <strong>Enviado por:</strong><br />
                  {pagoDetalle.sender_name}
                </Col>
              )}
              {pagoDetalle.sender_bank && (
                <Col span={12}>
                  <strong>Banco Origen:</strong><br />
                  {pagoDetalle.sender_bank}
                </Col>
              )}
              {pagoDetalle.transaction_id && (
                <Col span={24}>
                  <strong>ID de Transacción:</strong><br />
                  <code>{pagoDetalle.transaction_id}</code>
                </Col>
              )}
              {pagoDetalle.descripcion && (
                <Col span={24}>
                  <strong>Descripción:</strong><br />
                  {pagoDetalle.descripcion}
                </Col>
              )}
              {pagoDetalle.webhook_event && (
                <Col span={24}>
                  <strong>Evento del Webhook:</strong><br />
                  <Tag>{pagoDetalle.webhook_event}</Tag>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
}
