import { Camera, Check, Pencil, X } from "lucide-react";
import { useRef, useState } from "react";
import type { Profile } from "../../../types/profile.types";
import {
  resolveFileUrl,
  uploadProfileImage,
} from "../../../services/file.service";

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
  onSave: (payload: HeaderPayload) => void | Promise<void>;
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
  const [isImageUploading, setIsImageUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imageSrc = resolveFileUrl(imagePath);

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

  async function handleSave() {
    await onSave({
      title: title.trim(),
      bio_description: bio.trim(),
      profile_image_path: imagePath.trim() || null,
    });
  }

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePath(previewUrl);

    try {
      setIsImageUploading(true);

      const uploaded = await uploadProfileImage(file);

      setImagePath(uploaded.url);

      await onSave({
        title: title.trim(),
        bio_description: bio.trim(),
        profile_image_path: uploaded.url,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      setImagePath(profile.profile_image_path ?? "");
    } finally {
      setIsImageUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      URL.revokeObjectURL(previewUrl);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="h-44 bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-800" />

      <div className="px-5 pb-6 md:px-8">
        <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="-mt-24 shrink-0">
              <div className="group relative h-36 w-36 overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 shadow-lg">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-400">
                    P
                  </div>
                )}

                {isEditing && (
                  <>
                    <button
                      type="button"
                      disabled={isImageUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:cursor-not-allowed"
                    >
                      <Camera className="h-5 w-5" />

                      <span className="text-sm font-semibold">
                        {isImageUploading ? "Yükleniyor..." : "Düzenle"}
                      </span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </>
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
                  disabled={isImageUploading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isImageUploading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  Profile image
                </p>

                <p className="break-all rounded-2xl bg-white px-4 py-3 text-xs text-slate-500">
                  {imagePath || "No image selected"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}