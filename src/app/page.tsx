'use client';

import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Typography } from 'antd';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return <div>Cargando...</div>;
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <ProtectedRoute>
      <div style={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15vh',
        gap: '20px',
      }}>
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '10vh' }}>Bienvenido <br />{session.user?.nombre}</Typography.Title>
        <Link href='/profile'>
          <Button type='dashed' style={{ height: '40px', width: '100%'}}>Ver Perfil</Button>
        </Link>
        <Link href='/info'>
          <Button type='dashed' style={{ height: '40px', width: '100%'}}>Información del Evento</Button>
        </Link>
      </div>
    </ProtectedRoute>
  );
}