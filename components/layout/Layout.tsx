import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingButtons } from '@/components/widgets/FloatingButtons';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 lg:pt-32">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
};
