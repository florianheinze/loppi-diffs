import type { ReactNode } from 'react';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Header title="Task Tracker" />
      <main>{children}</main>
    </div>
  );
}
