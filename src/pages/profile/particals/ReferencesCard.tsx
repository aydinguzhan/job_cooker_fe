import {
  Check,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ProfileReference } from "../../../types/profile.types";
import { UUID } from "../../../lib/utils";

type ReferencePayload = {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  position_title?: string | null;
};

type Props = {
  references: ProfileReference[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (payload: { references: ReferencePayload[] }) => void;
};

const emptyReference: ProfileReference = {
  id: UUID(),
  profile_id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company_name: "",
  position_title: "",
  status: "active",
};

export default function ReferencesCard({
  references,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const [localReferences, setLocalReferences] =
    useState<ProfileReference[]>(references);

  function handleEdit() {
    setLocalReferences(references);
    onEdit();
  }

  function handleCancel() {
    setLocalReferences(references);
    onCancel();
  }

  function removeReference(id: string) {
    setLocalReferences((prev) => prev.filter((item) => item.id !== id));
  }

  function addReference() {
    setLocalReferences((prev) => [
      ...prev,
      {
        ...emptyReference,
        id: UUID(),
      },
    ]);
  }

  function updateReference(
    id: string,
    field: keyof ReferencePayload,
    value: string,
  ) {
    setLocalReferences((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function handleSave() {
    const payload = localReferences
      .filter((item) => item.first_name.trim() && item.last_name.trim())
      .map((item) => ({
        first_name: item.first_name.trim(),
        last_name: item.last_name.trim(),
        email: item.email?.trim() || null,
        phone: item.phone?.trim() || null,
        company_name: item.company_name?.trim() || null,
        position_title: item.position_title?.trim() || null,
      }));

    onSave({ references: payload });
  }

  const visibleReferences = isEditing ? localReferences : references;

  return (
    <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-app">References</h2>
          <p className="text-sm text-soft">People who can refer you</p>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-app p-2 text-muted hover:bg-surface-strong hover:text-app"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 p-2 text-white hover:bg-slate-800"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-xl border border-app p-2 text-muted hover:bg-surface-strong hover:text-app"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visibleReferences.length === 0 && (
          <p className="rounded-2xl bg-surface-muted p-4 text-sm text-soft">
            No references added yet.
          </p>
        )}

        {visibleReferences.map((ref) => (
          <article
            key={ref.id}
            className="relative rounded-2xl border border-app bg-surface-muted p-4"
          >
            {isEditing && (
              <button
                type="button"
                onClick={() => removeReference(ref.id)}
                className="absolute right-3 top-3 rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {isEditing ? (
              <div className="space-y-3 pr-12">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={ref.first_name}
                    onChange={(e) =>
                      updateReference(ref.id, "first_name", e.target.value)
                    }
                    placeholder="First name"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />

                  <input
                    value={ref.last_name}
                    onChange={(e) =>
                      updateReference(ref.id, "last_name", e.target.value)
                    }
                    placeholder="Last name"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />
                </div>

                <input
                  value={ref.position_title ?? ""}
                  onChange={(e) =>
                    updateReference(ref.id, "position_title", e.target.value)
                  }
                  placeholder="Position title"
                  className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                />

                <input
                  value={ref.company_name ?? ""}
                  onChange={(e) =>
                    updateReference(ref.id, "company_name", e.target.value)
                  }
                  placeholder="Company name"
                  className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={ref.email ?? ""}
                    onChange={(e) =>
                      updateReference(ref.id, "email", e.target.value)
                    }
                    placeholder="Email"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />

                  <input
                    value={ref.phone ?? ""}
                    onChange={(e) =>
                      updateReference(ref.id, "phone", e.target.value)
                    }
                    placeholder="Phone"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-3 pr-12">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-elevated">
                  <UserRound className="h-5 w-5 text-muted" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-app">
                    {ref.first_name} {ref.last_name}
                  </h3>

                  <p className="truncate text-sm text-soft">
                    {ref.position_title}
                    {ref.company_name ? ` · ${ref.company_name}` : ""}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-soft">
                    {ref.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {ref.email}
                      </p>
                    )}

                    {ref.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {ref.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}

        {isEditing && (
          <button
            type="button"
            onClick={addReference}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-app py-3 text-sm font-semibold text-muted hover:bg-surface-strong hover:text-app"
          >
            <Plus className="h-4 w-4" />
            Add Reference
          </button>
        )}
      </div>
    </section>
  );
}
