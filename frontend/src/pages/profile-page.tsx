import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { profileApi } from '../api/endpoints/profile';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { useAuthStore } from '../stores/auth-store';

type ProfileForm = { full_name: string; bio: string; avatar_url: string; timezone: string };

export function ProfilePage() {
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: profileApi.get });
  const { register, handleSubmit, reset } = useForm<ProfileForm>({ defaultValues: { full_name: '', bio: '', avatar_url: '', timezone: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (data) {
      reset({ full_name: data.full_name ?? '', bio: data.bio ?? '', avatar_url: data.avatar_url ?? '', timezone: data.timezone ?? '' });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: profileApi.update,
    onSuccess: (user) => {
      if (accessToken) setSession({ accessToken, user });
      message.success('Profile updated');
    },
  });

  if (isLoading || !data) return <LoadingState label="Loading profile..." />;

  return (
    <div className="grid gap-6">
      <PageHeader title="Profile" description="Personalize your workspace and keep your account details up to date." />
      <SectionCard>
        <form className="grid gap-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Full name" {...register('full_name')} />
            <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Timezone" {...register('timezone')} />
          </div>
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Avatar URL" {...register('avatar_url')} />
          <textarea rows={5} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Bio" {...register('bio')} />
          <div className="flex justify-end"><Button type="primary" htmlType="submit" loading={mutation.isPending}>Save changes</Button></div>
        </form>
      </SectionCard>
    </div>
  );
}
