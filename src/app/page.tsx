'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Typography } from 'antd';

export default function Home() {
  const { data: session } = useSession();
  
  return (
      <div style={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15vh',
        gap: '20px',
      }}>
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '5vh', fontFamily: 'DTMF', fontWeight: '100', color: '#f1d498' }}>Bienvenido <br />{session?.user?.nombre}</Typography.Title>
        <Link href='/profile'>
          <Button type='dashed' style={{ height: '40px', width: '100%'}}>Ver Perfil</Button>
        </Link>
        <Link href='/info'>
          <Button type='dashed' style={{ height: '40px', width: '100%'}}>Evento</Button>
        </Link>
      </div>
  );
}