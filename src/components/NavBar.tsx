'use client';

import { Layout, Button, Typography, Space, Card, Image } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { MenuOutlined, QrcodeOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useState } from 'react';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { Avatar } from './avatar';
import { useTheme } from '@/context/ThemeContext';


const { Header } = Layout;
const { Text } = Typography;

export const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin } = useRoleCheck(); 
  const { themeMode } = useTheme();
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleViewProfile = () => {
    router.push(`/profile`);
  };
  const loggedIn = session?.user?.email;
  const navItems = [
    {
      key: 'Home',
      href: '/',
      secureRoute: true,
    },
    {
      key: 'Info',
      href: '/info',
      loggedIn: true,
    },
    {
      adminOnly: true,
      key: 'Users',
      href: '/users',
    },
    {
      adminOnly: true,
      key: 'Dashboard',
      href: '/dashboard',
    },
    {
      adminOnly: true,
      key: 'Verificar Qr',
      href: '/verificar-qr',
      icon: <QrcodeOutlined style={{ fontSize: '30px', marginRight: '10px' }} />
    },
  ].filter(item => isAdmin || (loggedIn && !item.adminOnly) || item.secureRoute);
  return (
    <>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          background: menuOpen ? 'rgb(202 140 18 / 70%)' : 'transparent',
          backdropFilter:'blur(10px)',
          WebkitBackdropFilter:'blur(10px)',
          color: themeMode === 'dark' ? 'white' : 'black',
          position: 'fixed',
          top: '20px',
          left: isMobile ? '24px' : '50%',
          right: isMobile ? '24px' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          zIndex: 1000,
          margin: '0 auto',
          width: !isMobile ? '25%' : '',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
          borderRadius: '15px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image src="/logo.png" alt="Logo" width={200} height={100} preview={false} style={{ objectFit: 'cover'}} />
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
            <Button
              type="text"
              variant='link'
              icon={menuOpen 
                ? <CloseOutlined style={{ fontSize: '20px', color: 'white' }} />
                : <MenuOutlined style={{ fontSize: '20px', color: 'white' }} />
              }
              onClick={() => setMenuOpen(!menuOpen)}
            />
          
        </div>
      </Header>
      
      
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'url(/tiger.svg)',
            backgroundSize: 'cover',
            backgroundColor: '#ca8c12',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)', // Para compatibilidad con Safari
            transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 999,
            paddingTop: isMobile ? '15px' : '85px', // Para dejar espacio para el NavBar
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ margin: '0 auto', padding: '20px', marginTop: '80px', display: 'grid', gap: '5px', textAlign: 'center' }}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.key} onClick={() => setMenuOpen(false)}>
                <Typography.Title 
                  level={2} 
                  style={{ 
                    fontSize: '35px', 
                    fontFamily: 'DTMF', 
                    color: 'white', 
                    fontWeight: '100',
                    margin: 0,
                    padding: 0
                  }} 
                >
                  {item.icon ? item.icon : null}
                  {item.key}
                </Typography.Title>
              </Link>
            ))}
          </div>
          
          <div style={{ 
            maxWidth: isMobile ? '100vw' : '50vw', 
            margin: '0 auto', 
            padding: '20px', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card hoverable variant='borderless' style={{ backgroundColor: 'transparent', backdropFilter: 'blur(10px)' }} onClick={handleViewProfile}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  gap: '12px',
                  width: '100%' 
                }}>
                  <Avatar defaultIcon={true} />
                  <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '16px', color: 'white' }}>
                      {session?.user?.nombre || session?.user?.name || session?.user?.email}
                    </Text>
                    <br />
                    <Text type="secondary">{session?.user?.email}</Text>
                  </div>
                </div>
              </Card>
              {session ? <Button 
                type="primary" 
                danger
                block
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button> : <Button type="primary" onClick={() => router.push('/login')} style={{ margin: '0 auto', width: '100%' }}>Iniciar Sesión</Button>
            }
          </Space>
        </div>
        </div>
    </>
  );
}; 