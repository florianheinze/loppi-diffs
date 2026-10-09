import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header>
        <h1>Task Tracker</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
