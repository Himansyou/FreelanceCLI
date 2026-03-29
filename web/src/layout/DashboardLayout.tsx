import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body selection:bg-primary selection:text-on-primary h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="ml-64 h-screen flex flex-col overflow-y-auto">
        <TopBar />
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
