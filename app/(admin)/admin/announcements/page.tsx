"use client";

import { useEffect, useState } from "react";
import { Truck, Sparkles, Plus, Pencil, Trash2, Check, X, GripVertical, ToggleLeft, ToggleRight } from "lucide-react";

type AnnouncementType = "DELIVERY" | "OFFER";

interface Announcement {
  id: string;
  text: string;
  type: AnnouncementType;
  isActive: boolean;
  order: number;
}

const TYPE_OPTIONS: { value: AnnouncementType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "DELIVERY", label: "Delivery", icon: Truck, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { value: "OFFER", label: "Offer", icon: Sparkles, color: "bg-purple-50 text-purple-600 border-purple-200" },
];

function TypeBadge({ type }: { type: AnnouncementType }) {
  const opt = TYPE_OPTIONS.find(o => o.value === type)!;
  const Icon = opt.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${opt.color}`}>
      <Icon className="w-3 h-3" /> {opt.label}
    </span>
  );
}

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formText, setFormText] = useState("");
  const [formType, setFormType] = useState<AnnouncementType>("OFFER");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    setAnnouncements(data.announcements ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setFormText("");
    setFormType("OFFER");
    setShowForm(true);
    setError("");
  }

  function openEdit(a: Announcement) {
    setEditId(a.id);
    setFormText(a.text);
    setFormType(a.type);
    setShowForm(true);
    setError("");
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setError("");
  }

  async function save() {
    if (!formText.trim()) { setError("Text is required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/admin/announcements/${editId}` : "/api/admin/announcements";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formText.trim(), type: formType, isActive: true }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save");
      } else {
        setShowForm(false);
        setEditId(null);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(a: Announcement) {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !a.isActive }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage the rotating banner shown at the top of the site.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#5B1E7A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#4a1866] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4">{editId ? "Edit Announcement" : "New Announcement"}</h2>

          {/* Type selector */}
          <div className="flex gap-3 mb-4">
            {TYPE_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = formType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormType(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#5B1E7A] text-white border-[#5B1E7A]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#5B1E7A]"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {opt.label}
                </button>
              );
            })}
          </div>

          {/* Text input */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Announcement Text</label>
            <input
              type="text"
              value={formText}
              onChange={e => setFormText(e.target.value)}
              maxLength={300}
              placeholder={formType === "DELIVERY" ? "e.g. Free Shipping on Orders Above ₹999" : "e.g. Festive Season Sale — Up to 50% Off"}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1E7A]/30 focus:border-[#5B1E7A]"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{formText.length}/300</p>
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button onClick={cancelForm} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#5B1E7A] text-white rounded-xl hover:bg-[#4a1866] disabled:opacity-60"
            >
              <Check className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading…</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No announcements yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(a => (
            <div
              key={a.id}
              className={`flex items-start gap-3 bg-white border rounded-2xl p-4 shadow-sm transition-opacity ${!a.isActive ? "opacity-50" : ""}`}
            >
              <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TypeBadge type={a.type} />
                  {!a.isActive && <span className="text-xs text-gray-400 font-medium">Hidden</span>}
                </div>
                <p className="text-sm text-gray-800 leading-snug">{a.text}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(a)}
                  title={a.isActive ? "Hide" : "Show"}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#5B1E7A] hover:bg-purple-50 transition-colors"
                >
                  {a.isActive ? <ToggleRight className="w-5 h-5 text-[#5B1E7A]" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => openEdit(a)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
