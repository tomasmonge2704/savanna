'use client';

import { Typography, Layout, Button, Timeline} from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';


const { Title } = Typography;
const { Content } = Layout;

export default function InfoPage() {
  return (
    <Content className='home-page-background' style={{ marginTop: '7vh', textAlign: 'center', display: 'grid', gap: '15px', justifyContent: 'center' }}>
      <div style={{ minWidth: '50vw' }}>
      <Title level={1} style={{ fontSize: '50px', color: '#ca8c12', marginBottom: '5px' }} >
      30/08
      </Title>
        <Button 
          style={{ height: '30px', width: '100%'}} 
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
    </Content>

  );
}