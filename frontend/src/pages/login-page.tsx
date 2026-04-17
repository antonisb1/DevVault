import { Button, message } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { authApi } from '../api/endpoints/auth';
import { AuthFormShell } from '../features/auth/components/auth-form-shell';
import { useAuthStore } from '../stores/auth-store';

type LoginForm = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return (
    <AuthFormShell title="Welcome back" subtitle="Sign in to continue building your developer career workspace.">
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => {
        try {
          const response = await authApi.login(values);
          setSession({ accessToken: response.access_token, user: response.user });
          message.success('Logged in successfully');
          navigate('/dashboard');
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Failed to login');
        }
      })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Email" {...register('email', { required: true })} />
        <input type="password" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Password" {...register('password', { required: true })} />
        <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>Login</Button>
      </form>
      <p className="mt-6 text-sm text-[var(--text-muted)]">No account yet? <Link className="text-[var(--brand)]" to="/register">Create one</Link></p>
    </AuthFormShell>
  );
}
