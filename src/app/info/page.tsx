'use client';

import { Typography, Layout, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Content } = Layout;

export default function InfoPage() {
  return (
    <Content className='home-page-background' style={{ marginTop: '7vh', textAlign: 'center', display: 'grid', gap: '10px', justifyContent: 'center' }}>
      <div>
      <Title level={1} style={{ fontSize: '50px', color: '#ca8c12', marginBottom: '5px' }} >
        SAVANNA
      </Title>
        <Button 
          style={{ height: '22px', width: '100%'}} 
          type='dashed' 
          icon={<EnvironmentOutlined />}
          onClick={() => window.open('https://maps.app.goo.gl/ECJrwr66WAXWuwedA', '_blank')}
        >
          Ubicación
        </Button>
      </div>
      
      <Title level={1} style={{ marginTop: '50px' }} >
        LINE UP
      </Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Text className="slide-in-text slide-delay-2" style={{ fontSize: '20px' }}>
        TOMAS MONGE
      </Text>
      <Text className="slide-in-text slide-delay-2" style={{ fontSize: '20px' }}>
        TOBIAS GERARD
      </Text>
      </div>
    </Content>
  );
}