import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api/endpoints/auth';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '../../stores/auth-store';

export function Topbar() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);

  async function handleLogout() {
    await authApi.logout().catch(() => undefined);
    clearSession();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Welcome back</p>
          <h2 className="text-xl font-semibold">{user?.full_name || user?.username || 'Developer'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
}
