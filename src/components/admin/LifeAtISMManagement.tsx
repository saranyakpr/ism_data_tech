"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Images,
  ImagePlus,
  Upload,
  RefreshCw,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

type GalleryCategory = "brainstorming" | "cultural" | "outing" | "fun";

type GalleryPhoto = {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  image_path: string | null;
  image_url: string;
  is_legacy: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "brainstorming", label: "Brainstorming" },
  { value: "cultural",      label: "Cultural Events" },
  { value: "outing",        label: "Team Outings" },
  { value: "fun",           label: "Workplace Fun" },
];

const FIELD_CLASS =
  "admin-field w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none";

async function safeParseJson<T>(
  response: Response,
): Promise<{ data: T | null; parseError: string | null }> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      data: null,
      parseError: `Server returned unexpected content (HTTP ${response.status}).`,
    };
  }
  try {
    return { data: (await response.json()) as T, parseError: null };
  } catch {
    return { data: null, parseError: "Unable to parse server response." };
  }
}

/* ═══════════════════ EDIT MODAL ══════════════════ */
function EditModal({
  photo,
  onClose,
  onSaved,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title,    setTitle]    = useState(photo.title);
  const [caption,  setCaption]  = useState(photo.caption);
  const [category, setCategory] = useState<GalleryCategory>(photo.category);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error,    setError]    = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required."); return; }

    if (newImage) {
      if (newImage.size > 4 * 1024 * 1024) { setError("Image must be 4 MB or less."); return; }
      if (!["image/jpeg", "image/png", "image/webp"].includes(newImage.type)) {
        setError("Only JPG, PNG and WebP images are allowed."); return;
      }
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("id",       photo.id);
      fd.append("title",    title.trim());
      fd.append("caption",  caption.trim());
      fd.append("category", category);
      if (newImage) fd.append("image", newImage);

      const response = await fetch("/api/admin/life-at-ism", {
        method: "PATCH",
        body: fd,
      });

      const { data, parseError } = await safeParseJson<{ error?: string; message?: string }>(response);
      if (parseError) throw new Error(parseError);
      if (!response.ok) throw new Error(data?.error ?? `Save failed (HTTP ${response.status}).`);

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Edit photo: ${photo.title}`}
    >
      <div className="admin-editor-card w-full max-w-xl rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="admin-eyebrow">Gallery management</p>
            <h2 className="mt-1 text-xl font-bold text-white">Edit Photo</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-secondary-button p-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current image preview */}
        {photo.image_url && (
          <div className="mb-5 overflow-hidden rounded-xl border border-white/10 aspect-[16/9] bg-[#07162b]">
            <img
              src={photo.image_url}
              alt={photo.title}
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        <form onSubmit={(e) => void handleSave(e)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <label className="block">
              <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Title *</span>
              <input
                required maxLength={150} value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={FIELD_CLASS}
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Category *</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className={FIELD_CLASS}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>

            {/* Caption */}
            <label className="block sm:col-span-2">
              <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Caption</span>
              <textarea rows={3} maxLength={1000} value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`${FIELD_CLASS} resize-y`}
              />
            </label>

            {/* Replace image */}
            <label className="block sm:col-span-2">
              <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">
                Replace image <span className="font-normal text-slate-500">(optional)</span>
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-white/10 bg-[#07162b] p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
              />
              <span className="mt-1 block text-xs text-slate-500">
                JPG, PNG or WebP · max 4 MB · leave empty to keep current image
              </span>
              {newImage && (
                <p className="mt-1 text-sm text-blue-300">Selected: {newImage.name}</p>
              )}
            </label>
          </div>

          {error && <p role="alert" className="admin-alert mt-4">{error}</p>}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="admin-secondary-button">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-new-job disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <><RefreshCw size={16} className="animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle2 size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════ DELETE CONFIRM ═════════════= */
function DeleteConfirm({
  photo,
  onClose,
  onDeleted,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/life-at-ism", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id }),
      });

      const { data, parseError } = await safeParseJson<{ error?: string; message?: string }>(response);
      if (parseError) throw new Error(parseError);
      if (!response.ok) throw new Error(data?.error ?? `Delete failed (HTTP ${response.status}).`);

      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete photo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
    >
      <div className="admin-editor-card w-full max-w-md rounded-2xl p-6 sm:p-8">
        {/* Warning icon */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-lg font-bold text-white">Delete Photo</h2>
        </div>

        <p className="mb-2 text-sm text-slate-300">
          Are you sure you want to delete this photo from the gallery?
        </p>

        {/* Photo summary */}
        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
          {photo.image_url && (
            <div className="mb-3 overflow-hidden rounded-lg aspect-[16/9] bg-[#07162b]">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="h-full w-full object-cover opacity-80"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <p className="font-semibold text-white">{photo.title}</p>
          <p className="mt-0.5 text-xs text-blue-300">
            {CATEGORIES.find((c) => c.value === photo.category)?.label ?? photo.category}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {photo.is_legacy
              ? "Original legacy photo — the image file will NOT be deleted from the server."
              : "Uploaded photo — the image file will be permanently deleted from storage."}
          </p>
        </div>

        <p className="mb-5 text-xs text-red-400">This action cannot be undone.</p>

        {error && <p role="alert" className="admin-alert mb-4">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="admin-secondary-button">
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => void handleDelete()}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <><RefreshCw size={15} className="animate-spin" /> Deleting…</>
            ) : (
              <><Trash2 size={15} /> Delete Photo</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN COMPONENT ═════════════ */
export default function LifeAtISMManagement() {
  const [photos,    setPhotos]    = useState<GalleryPhoto[]>([]);
  const [title,     setTitle]     = useState("");
  const [caption,   setCaption]   = useState("");
  const [category,  setCategory]  = useState<GalleryCategory>("brainstorming");
  const [image,     setImage]     = useState<File | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // Edit / delete state
  const [editPhoto,   setEditPhoto]   = useState<GalleryPhoto | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<GalleryPhoto | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Load photos ── */
  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/life-at-ism", { cache: "no-store" });
      const { data, parseError } = await safeParseJson<{ photos?: GalleryPhoto[]; error?: string }>(response);
      if (parseError) throw new Error(parseError);
      if (!response.ok) throw new Error(data?.error ?? `Server error (HTTP ${response.status}).`);
      if (!Array.isArray(data?.photos)) throw new Error("API response does not contain a photos array.");
      setPhotos(data.photos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load gallery photos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadPhotos(); }, [loadPhotos]);

  /* ── Upload photo ── */
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setSuccess("");
    if (!title.trim()) { setError("Please enter a photo title."); return; }
    if (!image)        { setError("Please select an image."); return; }
    if (image.size > 4 * 1024 * 1024) { setError("Image size must be 4 MB or less."); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      setError("Only JPG, PNG and WebP images are allowed."); return;
    }
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("title",    title.trim());
      fd.append("caption",  caption.trim());
      fd.append("category", category);
      fd.append("image",    image);

      const response = await fetch("/api/admin/life-at-ism", { method: "POST", body: fd });
      const { data, parseError } = await safeParseJson<{ error?: string }>(response);
      if (parseError) throw new Error(parseError);
      if (!response.ok) throw new Error(data?.error ?? `Upload failed (HTTP ${response.status}).`);

      setTitle(""); setCaption(""); setCategory("brainstorming"); setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess("Photo uploaded successfully!");
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const publishedCount  = photos.filter((p) => p.is_published).length;
  const newUploadsCount = photos.filter((p) => !p.is_legacy).length;

  return (
    <>
      {/* ── Edit Modal ── */}
      {editPhoto && (
        <EditModal
          photo={editPhoto}
          onClose={() => setEditPhoto(null)}
          onSaved={() => {
            setEditPhoto(null);
            setSuccess("Photo updated successfully!");
            void loadPhotos();
          }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deletePhoto && (
        <DeleteConfirm
          photo={deletePhoto}
          onClose={() => setDeletePhoto(null)}
          onDeleted={() => {
            setDeletePhoto(null);
            setSuccess("Photo deleted successfully!");
            void loadPhotos();
          }}
        />
      )}

      <section className="admin-section admin-enter">
        {/* Heading */}
        <div className="admin-section-heading">
          <div className="flex items-center gap-4">
            <div className="admin-heading-icon"><Images size={23} /></div>
            <div>
              <p className="admin-eyebrow">Company culture workspace</p>
              <h1 className="admin-title">Life at ISM</h1>
              <p className="admin-subtitle">Manage photos displayed in the Life at ISM website gallery.</p>
            </div>
          </div>
          <button type="button" onClick={() => void loadPhotos()} disabled={isLoading} className="admin-secondary-button">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-summary-grid">
          <article className="admin-stat-card admin-stat-blue">
            <div className="admin-stat-icon"><Images size={22} /></div>
            <div><p>Total Photos</p><strong>{isLoading ? "—" : photos.length}</strong></div>
          </article>
          <article className="admin-stat-card admin-stat-green">
            <div className="admin-stat-icon"><CheckCircle2 size={22} /></div>
            <div><p>Published Photos</p><strong>{isLoading ? "—" : publishedCount}</strong></div>
          </article>
          <article className="admin-stat-card admin-stat-purple">
            <div className="admin-stat-icon"><ImagePlus size={22} /></div>
            <div><p>New Uploads</p><strong>{isLoading ? "—" : newUploadsCount}</strong></div>
          </article>
        </div>

        {/* Global success */}
        {success && (
          <p className="mb-4 flex items-center gap-2 text-sm text-green-400">
            <CheckCircle2 size={17} />{success}
          </p>
        )}

        {/* Upload form */}
        <div className="admin-editor-card rounded-2xl p-5 sm:p-7">
          <div className="mb-6">
            <p className="admin-eyebrow">Gallery management</p>
            <h2 className="mt-2 text-xl font-bold text-white">Upload New Photo</h2>
            <p className="mt-1 text-sm text-slate-400">Add a new photo to the Life at ISM website gallery.</p>
          </div>

          <form onSubmit={(e) => void handleUpload(e)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Photo title *</span>
                <input required maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: Team Celebration" className={FIELD_CLASS} />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Category *</span>
                <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className={FIELD_CLASS}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Photo caption</span>
                <textarea rows={3} maxLength={1000} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a short description..." className={`${FIELD_CLASS} resize-y`} />
              </label>
              <label className="block sm:col-span-2">
                <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">Select photo *</span>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" required onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="block w-full rounded-xl border border-white/10 bg-[#07162b] p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500" />
                <span className="mt-2 block text-xs text-slate-500">JPG, PNG or WebP. Maximum file size: 4 MB.</span>
                {image && <p className="mt-2 text-sm text-blue-300">Selected: {image.name}</p>}
              </label>
            </div>
            {error && <p role="alert" className="admin-alert mt-4">{error}</p>}
            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={isUploading} className="admin-new-job disabled:cursor-not-allowed disabled:opacity-50">
                <Upload size={17} />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery grid */}
        <div className="mt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Gallery Photos</h2>
              <p className="mt-1 text-sm text-slate-400">Existing photos and newly uploaded photos.</p>
            </div>
            <span className="admin-pill admin-pill-blue">{photos.length} Photos</span>
          </div>

          {isLoading ? (
            <div className="admin-empty">Loading gallery photos…</div>
          ) : error && photos.length === 0 ? (
            <div className="admin-empty">
              <p className="text-red-400 mb-2">{error}</p>
              <button type="button" onClick={() => void loadPhotos()} className="admin-secondary-button mt-2">
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ) : photos.length === 0 ? (
            <div className="admin-empty">
              <Images size={28} className="mx-auto mb-3 text-blue-300/70" />
              <p>No gallery photos found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => (
                <article key={photo.id} className="admin-table-card overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-[#07162b]">
                    {photo.image_url ? (
                      <img src={photo.image_url} alt={photo.title} loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Images size={32} className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{photo.title}</h3>
                      <span className="admin-pill admin-pill-blue shrink-0">
                        {photo.is_legacy ? "Existing" : "New"}
                      </span>
                    </div>
                    <p className="mb-3 text-xs text-blue-300">
                      {CATEGORIES.find((c) => c.value === photo.category)?.label ?? photo.category}
                    </p>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-400">
                      {photo.caption || "No caption added."}
                    </p>

                    {/* Footer row */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 gap-2">
                      <span className={photo.is_published ? "text-xs text-green-400" : "text-xs text-amber-400"}>
                        {photo.is_published ? "Published" : "Unpublished"}
                      </span>

                      {/* Edit + Delete buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditPhoto(photo)}
                          title="Edit photo"
                          className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20 hover:text-blue-200"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletePhoto(photo)}
                          title="Delete photo"
                          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
