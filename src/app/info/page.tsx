'use client';

import { Typography, Layout, Button, Timeline, Card} from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { isMobile } from 'react-device-detect';

const { Title } = Typography;
const { Content } = Layout;

export default function InfoPage() {
  return (
    <ProtectedRoute>
    <Content className='home-page-background' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Card variant='borderless' style={{ width: isMobile ? '85vw' : '25vw', backgroundColor: 'transparent',textAlign: 'center', display: 'grid', justifyContent: 'center', gap: '15px' }}> 
      <Title level={1} style={{ fontSize: '30px', color: '#f1d498', fontFamily: 'DTMF', fontWeight: '100'}} >30 DE AGOSTO</Title>
     
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
            children: <span style={{ fontSize: '20px', color: 'white', fontFamily: 'DTMF' }}>TOMAS MONGE</span>,
          },
          {
            label: '03:30',
            children: <span style={{ fontSize: '20px', color: 'white', fontFamily: 'DTMF' }}>TOBIAS GERARD</span>,
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