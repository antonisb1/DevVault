import { ThemeToggle } from '../components/ui/theme-toggle';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';

export function SettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Settings" description="A lightweight settings area for theme and environment awareness." />
      <SectionCard title="Appearance" subtitle="Switch between light and dark mode.">
        <ThemeToggle />
      </SectionCard>
    </div>
  );
}
