import { Button, Modal } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { SavedLink } from "../../../api/types";

type FormValues = {
  title: string;
  url: string;
  description: string;
  category: string;
  favorite: boolean;
  tag_names: string;
};
function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}
const defaults: FormValues = {
  title: "",
  url: "",
  description: "",
  category: "",
  favorite: false,
  tag_names: "",
};

export function SavedLinkForm({
  open,
  initialValues,
  onClose,
  onSubmit,
  saving,
}: {
  open: boolean;
  initialValues?: SavedLink | null;
  onClose: () => void;
  onSubmit: (
    values: Omit<FormValues, "tag_names"> & { tag_names: string[] },
  ) => Promise<unknown>;
  saving?: boolean;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: defaults,
  });
  useEffect(() => {
    reset(
      initialValues
        ? {
            title: initialValues.title,
            url: initialValues.url,
            description: initialValues.description ?? "",
            category: initialValues.category ?? "",
            favorite: initialValues.favorite,
            tag_names: initialValues.tag_names.join(", "),
          }
        : defaults,
    );
  }, [initialValues, reset]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={initialValues ? "Edit link" : "Save link"}
      destroyOnHidden
    >
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            ...values,
            tag_names: values.tag_names
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          });
          onClose();
        })}
      >
        <input
          className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        <input
          className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3"
          placeholder="URL"
          {...register("url", { required: true })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3"
            placeholder="Category"
            {...register("category")}
          />
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm">
            <input type="checkbox" {...register("favorite")} /> Favorite
          </label>
        </div>
        <input
          className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3"
          placeholder="Tags (comma separated)"
          {...register("tag_names")}
        />
        <textarea
          rows={4}
          className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3"
          placeholder="Description"
          {...register("description")}
        />
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
