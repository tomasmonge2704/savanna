'use client';

import { ReactNode } from 'react';
import { Layout } from 'antd';
import { NavBar } from '@/components/NavBar';
import { useTheme } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';

const { Content } = Layout;

interface NavBarWrapperProps {
  children: ReactNode;
}

export function NavBarWrapper({ children }: NavBarWrapperProps) {
  const { themeMode } = useTheme();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: themeMode === 'dark' ? 'rgb(0 0 0 / 20%)' : '#f0f0f0',
      backdropFilter: 'blur(10px)'
    }}>
      {!isLoginPage && <NavBar />}
      <Content style={{ 
        padding: isLoginPage ? 0 : '24px',
        marginTop: isLoginPage ? '0px' : '80px',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        {children}
      </Content>
    </Layout>
  );
} 