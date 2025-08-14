'use client';

import { Typography, Layout, Button, Timeline, Card} from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title } = Typography;
const { Content } = Layout;

export default function InfoPage() {
  return (
    <ProtectedRoute>
    <Content className='home-page-background' style={{ textAlign: 'center', display: 'grid', justifyContent: 'center', gap: '15px' }}>
    <Title level={1} style={{ fontSize: '30px', color: '#f1d498', fontFamily: 'DTMF', fontWeight: '100', margin: '0' }} >30 DE AGOSTO</Title>
      <Card variant='borderless'>      
      <Button 
          style={{ height: '30px', width: '120px', margin: '0 auto'}} 
          type='dashed' 
          icon={<EnvironmentOutlined />}
          onClick={() => window.open('https://maps.app.goo.gl/ECJrwr66WAXWuwedA', '_blank')}
        >
          Ubicación
        </Button>
      <Title level={1} style={{ marginTop: '50px', fontFamily: 'DTMF', fontWeight: '100', color: '#f1d498' }} >
        LINE UP
      </Title>
      <Timeline
        mode='alternate'
        style={{
          width: '100%',
        }}
        items={[
          {
            label: '12:00',
            children: <span style={{ fontSize: '20px', color: 'white' }}>TOMAS MONGE</span>,
          },
          {
            label: '03:30',
            children: <span style={{ fontSize: '20px', color: 'white' }}>TOBIAS GERARD</span>,
          },
          {
            label: '06:00',
            children: '???',
          },
        ]}
      />
      </Card>
    </Content>
    </ProtectedRoute>
  );
}