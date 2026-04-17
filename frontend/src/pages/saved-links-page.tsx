import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message } from "antd";
import { useState } from "react";
import { normalizeUrl } from "../lib/url";
import { savedLinksApi } from "../api/endpoints/savedLinks";
import type { SavedLink } from "../api/types";
import { TagBadges } from "../components/shared/tag-badges";
import { EmptyState } from "../components/ui/empty-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { SavedLinkForm } from "../features/saved-links/components/saved-link-form";
import { relativeTime } from "../lib/format";

export function SavedLinksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SavedLink | null>(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const { data, isLoading } = useQuery({
    queryKey: ["saved-links", search],
    queryFn: () =>
      savedLinksApi.list(params.toString() ? `?${params.toString()}` : ""),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) =>
      editing
        ? savedLinksApi.update(editing.id, payload)
        : savedLinksApi.create(payload as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      message.success(editing ? "Link updated" : "Link saved");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: savedLinksApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-links"] });
      message.success("Link deleted");
    },
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Saved Links"
        description="Keep important docs, repos, tutorials, and references close at hand."
        action={
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Save link
          </Button>
        }
      />
      <input
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
        placeholder="Search links..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {isLoading ? <LoadingState label="Loading links..." /> : null}
      {!isLoading && !data?.items.length ? (
        <EmptyState
          title="No saved links yet"
          description="Save references you want to revisit without losing them across tabs."
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.items.map((link) => (
          <SectionCard
            key={link.id}
            title={link.title}
            subtitle={`${link.category || "General"} • ${relativeTime(link.updated_at)}`}
            action={
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(link);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => deleteMutation.mutate(link.id)}
                >
                  Delete
                </Button>
              </div>
            }
          >
            <p className="text-sm text-[var(--text-muted)]">
              {link.description || "No description provided."}
            </p>
            <a
              href={normalizeUrl(link.url)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-medium text-[var(--brand)]"
            >
              Open resource ↗
            </a>
            <div className="mt-4">
              <TagBadges tags={link.tag_names} />
            </div>
          </SectionCard>
        ))}
      </div>
      <SavedLinkForm
        open={modalOpen}
        initialValues={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={(values) => saveMutation.mutateAsync(values)}
        saving={saveMutation.isPending}
      />
    </div>
  );
}
