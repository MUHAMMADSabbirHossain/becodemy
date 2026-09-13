import SidebarWrapper from '@/shared/components/sidebar/sidebar';
import React, { JSX } from 'react';

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div className="flex h-full bg-black min-h-screen">
      {/* Sidebar */}
      <aside className="w-70 min-w-62.5 max-w-75 border-r border-r-slate-800 text-white p-4">
        <div className="sticky top-0">
          <SidebarWrapper />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1">
        <div className="overflow-hidden">{children}</div>
      </main>

      {children}
    </div>
  );
};

export default Layout;
