import { useState } from 'react';
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="font-body selection:bg-primary selection:text-on-primary h-screen w-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="h-screen flex flex-col overflow-y-auto md:ml-64">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
