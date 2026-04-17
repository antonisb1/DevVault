import { Button, message } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { authApi } from '../api/endpoints/auth';
import { AuthFormShell } from '../features/auth/components/auth-form-shell';
import { useAuthStore } from '../stores/auth-store';

type RegisterForm = { full_name: string; email: string; username: string; password: string };

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return (
    <AuthFormShell title="Create your DevVault" subtitle="Start with a polished workspace you can actually use every week.">
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => {
        try {
          const response = await authApi.register(values);
          setSession({ accessToken: response.access_token, user: response.user });
          message.success('Account created');
          navigate('/dashboard');
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Failed to register');
        }
      })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Full name" {...register('full_name')} />
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Email" {...register('email', { required: true })} />
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Username" {...register('username', { required: true })} />
        <input type="password" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Password" {...register('password', { required: true })} />
        <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>Create account</Button>
      </form>
      <p className="mt-6 text-sm text-[var(--text-muted)]">Already have an account? <Link className="text-[var(--brand)]" to="/login">Sign in</Link></p>
    </AuthFormShell>
  );
}
