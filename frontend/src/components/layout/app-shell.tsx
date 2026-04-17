import { Outlet } from 'react-router-dom';

import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell() {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
