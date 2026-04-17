import { Button } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand)]">404</p>
      <h1 className="text-4xl font-bold">This page escaped the vault</h1>
      <p className="max-w-lg text-sm text-[var(--text-muted)]">The route you requested does not exist. Head back to the dashboard and keep shipping.</p>
      <Link to="/dashboard"><Button type="primary">Go to dashboard</Button></Link>
    </div>
  );
}
