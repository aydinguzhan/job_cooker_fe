import { Camera, Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import type { Profile } from "../../../types/profile.types";

type HeaderPayload = {
  title: string;
  bio_description: string;
  profile_image_path: string | null;
};

type Props = {
  profile: Profile;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (payload: HeaderPayload) => void;
};

export default function ProfileHeaderCard({
  profile,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio_description ?? "");
  const [imagePath, setImagePath] = useState(profile.profile_image_path ?? "");

  function handleEdit() {
    setTitle(profile.title);
    setBio(profile.bio_description ?? "");
    setImagePath(profile.profile_image_path ?? "");
    onEdit();
  }

  function handleCancel() {
    setTitle(profile.title);
    setBio(profile.bio_description ?? "");
    setImagePath(profile.profile_image_path ?? "");
    onCancel();
  }

  function handleSave() {
    onSave({
      title: title.trim(),
      bio_description: bio.trim(),
      profile_image_path: imagePath.trim() || null,
    });
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="h-44 bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-800" />

      <div className="px-5 pb-6 md:px-8">
        <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="-mt-24 shrink-0">
              <div className="relative h-36 w-36 overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 shadow-lg">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-400">
                    P
                  </div>
                )}

                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 rounded-xl bg-slate-900 p-2 text-white"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="min-w-0 pt-0 sm:pt-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                Profile
              </p>

              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Profile title"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-xl font-bold outline-none focus:border-cyan-500"
                />
              ) : (
                <h1 className="mt-2 break-words text-2xl font-bold text-slate-950 md:text-3xl">
                  {profile.title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Check className="h-4 w-4" />
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="mb-2 text-sm font-bold text-slate-700">Bio</p>

            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                placeholder="Tell something about yourself..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-500"
              />
            ) : (
              <p className="text-sm leading-7 text-slate-600">
                {profile.bio_description || "No bio description added yet."}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-700">Profile Status</p>

            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {profile.status}
            </span>

            {isEditing && (
              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-slate-500">
                  Profile image path
                </label>

                <input
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  placeholder="/files/profile-images/..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}