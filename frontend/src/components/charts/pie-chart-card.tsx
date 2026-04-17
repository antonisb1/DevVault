import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';

import { SectionCard } from '../ui/section-card';

const palette = ['#4f46e5', '#22c55e', '#f97316', '#06b6d4', '#eab308', '#ef4444'];

export function PieChartCard({ title, data }: { title: string; data: Array<{ name: string; value: number }> }) {
  return (
    <SectionCard title={title} className="h-full">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid gap-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
              {entry.name}
            </span>
            <span className="font-medium text-[var(--text)]">{entry.value}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
